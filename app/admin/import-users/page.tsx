'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { toast } from 'sonner';

interface ParsedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  passwordResetRequired: boolean;
}

interface SheetResult {
  sheetName: string;
  users: ParsedUser[];
  errors: string[];
  preview: string[][];
}

export default function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<SheetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ sheet: SheetResult | null; open: boolean }>({ sheet: null, open: false });

  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import-users', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse file');
      }

      const data = await response.json();
      setResults(data.results);
      toast.success('File parsed successfully');
    } catch (error) {
      toast.error('Error parsing file');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async (sheet: SheetResult) => {
    try {
      const response = await fetch('/api/import-users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetName: sheet.sheetName,
          users: sheet.users,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to import users');
      }

      const data = await response.json();
      toast.success(`Imported ${data.createdUsers.length} users from ${sheet.sheetName}`);
      toast.info('Les utilisateurs importés ont le mot de passe temporaire : "123456"');
      if (data.errors.length > 0) {
        toast.warning(`Some errors occurred: ${data.errors.join(', ')}`);
      }
      setConfirmDialog({ sheet: null, open: false });
      // Refresh results or remove the sheet from results
      setResults(results.filter(r => r.sheetName !== sheet.sheetName));
    } catch (error) {
      toast.error('Error importing users');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Import Users from Excel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleFileUpload} disabled={!file || loading}>
              {loading ? 'Parsing...' : 'Parse File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Parsed Sheets</h2>
          <div className="space-y-4">
            {results.map((sheet) => (
              <Card key={sheet.sheetName}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {sheet.sheetName}
                    <Button
                      onClick={() => setConfirmDialog({ sheet, open: true })}
                      disabled={sheet.users.length === 0}
                    >
                      Import {sheet.users.length} Users
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sheet.preview && sheet.preview.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Aperçu des données (5 premières lignes) :</h3>
                      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                        {sheet.preview.map((row, index) => (
                          <div key={index} className="text-sm mb-1">
                            Ligne {index + 2}: {row.join(' | ')}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Colonnes attendues : NOM Prénom | Classe | Fonction dans le club | Mail
                      </p>
                    </div>
                  )}
                  {sheet.errors.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-red-600">Erreurs :</h3>
                      <div className="max-h-40 overflow-y-auto">
                        {sheet.errors.map((error, index) => (
                          <li key={index} className="text-red-600 text-sm">{error}</li>
                        ))}
                      </div>
                    </div>
                  )}
                  {sheet.users.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Users to Import:</h3>
                      <div className="max-h-40 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left">Email</th>
                              <th className="text-left">First Name</th>
                              <th className="text-left">Last Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sheet.users.map((user, index) => (
                              <tr key={index}>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Import</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to import {confirmDialog.sheet?.users.length} users from sheet "{confirmDialog.sheet?.sheetName}"?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDialog({ sheet: null, open: false })}>
              Cancel
            </Button>
            <Button onClick={() => confirmDialog.sheet && handleConfirmImport(confirmDialog.sheet)}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}