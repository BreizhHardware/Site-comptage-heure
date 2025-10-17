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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { DatePicker } from '../../components/ui/date-picker';
import { format } from 'date-fns';

interface Hour {
  id: number;
  date: string;
  duration: number;
  reason: string;
  status: string;
  user: { email: string };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hours, setHours] = useState<Hour[]>([]);
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [hoursInput, setHoursInput] = useState('');
  const [minutesInput, setMinutesInput] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    if (isAdmin) {
      router.push('/admin');
      return;
    }
    fetchHours();
  }, [session, status, router]);

  const fetchHours = async () => {
    const res = await fetch('/api/hours');
    if (res.ok) {
      const data = await res.json();
      setHours(data);
    }
  };

  const handleAddHour = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = parseInt(hoursInput) * 60 + parseInt(minutesInput);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    const res = await fetch('/api/hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateString, duration: totalMinutes, reason }),
    });
    if (res.ok) {
      setDate(undefined);
      setHoursInput('');
      setMinutesInput('');
      setReason('');
      fetchHours();
    }
  };

  const handleValidate = async (id: number, status: string) => {
    await fetch(`/api/hours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchHours();
  };

  if (status === 'loading') return <div>Chargement...</div>;

  const isAdmin =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  const isMember = session?.user?.role === 'MEMBER';

  const totalPending = hours
    .filter((h) => h.status === 'PENDING')
    .reduce((sum, h) => sum + h.duration, 0);
  const totalValidated = hours
    .filter((h) => h.status === 'VALIDATED')
    .reduce((sum, h) => sum + h.duration, 0);
  const totalRejected = hours
    .filter((h) => h.status === 'REJECTED')
    .reduce((sum, h) => sum + h.duration, 0);

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      {isMember && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Ajouter une heure</CardTitle>
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
                    min="0"
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
                    min="0"
                    max="59"
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
      )}
      <Card>
        <CardHeader>
          <CardTitle>Liste des heures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Statut</TableHead>
                {isAdmin && <TableHead>Utilisateur</TableHead>}
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((hour) => (
                <TableRow key={hour.id}>
                  <TableCell>
                    {new Date(hour.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{hour.duration} min</TableCell>
                  <TableCell>{hour.reason}</TableCell>
                  <TableCell>{hour.status}</TableCell>
                  {isAdmin && <TableCell>{hour.user.email}</TableCell>}
                  {isAdmin && (
                    <TableCell>
                      <Button
                        onClick={() => handleValidate(hour.id, 'VALIDATED')}
                        className="mr-2"
                      >
                        Valider
                      </Button>
                      <Button
                        onClick={() => handleValidate(hour.id, 'REJECTED')}
                        variant="destructive"
                      >
                        Rejeter
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Totaux</h2>
        <div className="flex space-x-4">
          <div>
            <h3 className="font-semibold">En attente</h3>
            <p>{formatHours(totalPending)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Validées</h3>
            <p>{formatHours(totalValidated)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Rejetées</h3>
            <p>{formatHours(totalRejected)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
