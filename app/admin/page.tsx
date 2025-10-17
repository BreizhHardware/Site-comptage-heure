'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { DatePicker } from '../../components/ui/date-picker';
import { format } from 'date-fns';

interface Hour {
  id: string;
  date: string;
  duration: number;
  reason: string;
  status: string;
  userId: string;
  user: { email: string; firstName?: string; lastName?: string; role: string };
}

interface Settings {
  name: string;
  logo: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hours, setHours] = useState<Hour[]>([]);
  const [settings, setSettings] = useState<Settings>({ name: '', logo: '' });
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [hoursInput, setHoursInput] = useState('');
  const [minutesInput, setMinutesInput] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
    ) {
      router.push('/dashboard');
      return;
    }
    fetchHours();
    fetchSettings();
  }, [session, status, router]);

  const fetchHours = async () => {
    const res = await fetch('/api/hours');
    if (res.ok) {
      const data = await res.json();
      setHours(data);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  const handleValidate = async (id: string, status: string) => {
    await fetch(`/api/hours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchHours();
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    let logoPath = settings.logo;
    if (logoFile) {
      const formData = new FormData();
      formData.append('file', logoFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        logoPath = uploadData.path;
      } else {
        alert('Erreur upload');
        return;
      }
    }
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: settings.name, logo: logoPath }),
    });
    setLogoFile(null);
    fetchSettings();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: newPassword,
        role: newRole,
        firstName: newFirstName,
        lastName: newLastName,
      }),
    });
    if (res.ok) {
      setNewEmail('');
      setNewPassword('');
      setNewRole('MEMBER');
      setNewFirstName('');
      setNewLastName('');
      toast.success('Utilisateur créé');
    }
  };

  const handleExport = (format: string) => {
    window.open(`/api/export?format=${format}`, '_blank');
  };

  const handleAddHour = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = parseInt(hoursInput) * 60 + parseInt(minutesInput);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    const res = await fetch('/api/hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateString,
        duration: totalMinutes,
        reason,
      }),
    });
    if (res.ok) {
      setDate(undefined);
      setHoursInput('');
      setMinutesInput('');
      setReason('');
      fetchHours();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/hours/${id}`, {
      method: 'DELETE',
    });
    fetchHours();
  };

  const userDisplayNames = hours.reduce(
    (acc, hour) => {
      const name =
        `${hour.user.firstName || ''} ${hour.user.lastName || ''}`.trim() ||
        hour.user.email;
      acc[hour.user.email] = name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const userMap = {} as Record<
    string,
    { name: string; email: string; role: string }
  >;
  hours.forEach((hour) => {
    userMap[hour.userId] = {
      name: userDisplayNames[hour.user.email],
      email: hour.user.email,
      role: hour.user.role,
    };
  });

  const userTotals = hours.reduce(
    (acc, hour) => {
      if (hour.status === 'VALIDATED') {
        acc[hour.userId] = (acc[hour.userId] || 0) + hour.duration;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
    setDialogOpen(false);
    setSelectedUser(null);
    fetchHours();
  };

  if (status === 'loading') return <div>Chargement...</div>;

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  const sortedHours = hours.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const displayedHours = showAll ? sortedHours : sortedHours.slice(0, 10);

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administration</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter des heures</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddHour} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
            <div className="flex space-x-2">
              <div>
                <Label htmlFor="hours">Heures</Label>
                <Input
                  id="hours"
                  type="number"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Raison</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Ajouter</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Gestion des heures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedHours.map((hour) => (
                <TableRow key={hour.id}>
                  <TableCell>
                    {new Date(hour.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{hour.duration} min</TableCell>
                  <TableCell>{hour.reason}</TableCell>
                  <TableCell>{hour.status}</TableCell>
                  <TableCell>{userDisplayNames[hour.user.email]}</TableCell>
                  <TableCell>
                    {hour.status === 'VALIDATED' ||
                    hour.status === 'REJECTED' ? (
                      <Button
                        onClick={() => handleDelete(hour.id)}
                        variant="destructive"
                      >
                        Supprimer
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleValidate(hour.id, 'VALIDATED')}
                          className="mr-2"
                          disabled={hour.userId === session?.user?.id}
                        >
                          Valider
                        </Button>
                        <Button
                          onClick={() => handleDelete(hour.id)}
                          variant="destructive"
                          disabled={hour.userId === session?.user?.id}
                        >
                          Supprimer
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {hours.length > 10 && !showAll && (
            <div className="mt-4">
              <Button onClick={() => setShowAll(true)}>Voir plus</Button>
            </div>
          )}
          <div className="mt-4">
            <h2 className="text-lg font-bold">Totaux par utilisateur</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Heures Validées</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(userTotals).map(([userId, total]) => (
                  <TableRow key={userId}>
                    <TableCell>{userMap[userId]?.name}</TableCell>
                    <TableCell>{formatHours(total)}</TableCell>
                    <TableCell>
                      {userMap[userId]?.role === 'SUPER_ADMIN' ? (
                        'Super Admin'
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedUser({
                              id: userId,
                              name: userMap[userId]?.name,
                            });
                            setDialogOpen(true);
                          }}
                          variant="destructive"
                        >
                          Supprimer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {isSuperAdmin && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="newEmail">Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newFirstName">Prénom</Label>
                <Input
                  id="newFirstName"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newLastName">Nom de famille</Label>
                <Input
                  id="newLastName"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newRole">Rôle</Label>
                <select
                  id="newRole"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="MEMBER">Membre</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <Button type="submit">Créer</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Paramètres du Club</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du Club</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              {settings.logo && <p>Actuel : {settings.logo}</p>}
            </div>
            <Button type="submit">Mettre à jour</Button>
          </form>
        </CardContent>
      </Card>
      {selectedUser && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleDeleteUser} variant="destructive">
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div>
        <Button onClick={() => handleExport('csv')} className="mr-2">
          Exporter CSV
        </Button>
        <Button onClick={() => handleExport('excel')}>Exporter Excel</Button>
      </div>
    </div>
  );
}
