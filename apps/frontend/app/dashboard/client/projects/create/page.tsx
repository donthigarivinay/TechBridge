'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [creating, setCreating] = useState(false);

    // Project Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');

    // Roles Form
    const [roles, setRoles] = useState<any[]>([
        { title: '', description: '', salary: '', skillsRequired: [] } // Simple string for skills initially
    ]);

    const addRole = () => {
        setRoles([...roles, { title: '', description: '', salary: '', skillsRequired: [] }]);
    };

    const updateRole = (index: number, field: string, value: any) => {
        const newRoles = [...roles];
        newRoles[index][field] = value;
        setRoles(newRoles);
    };

    const updateRoleSkills = (index: number, value: string) => {
        // Value is comma separated string
        // We'll process it on submit
        const newRoles = [...roles];
        newRoles[index].skillsInput = value; // Temporary field
        setRoles(newRoles);
    };

    const removeRole = (index: number) => {
        if (roles.length > 1) {
            const newRoles = [...roles];
            newRoles.splice(index, 1);
            setRoles(newRoles);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            // Process roles
            const processedRoles = roles.map(r => ({
                title: r.title,
                description: r.description,
                salary: parseFloat(r.salary),
                skills: r.skillsInput ? r.skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean) : []
            }));

            // Backend ProjectsController expects { title, description, budget, deadline, roles }
            // Note: date should be ISO string
            await api.post('/projects/request', {
                title,
                description,
                budget: parseFloat(budget),
                deadline: new Date(deadline).toISOString(),
                roles: processedRoles
            });

            toast({
                title: "Project Created",
                description: "Your project has been submitted for approval.",
            });

            router.push('/dashboard/client/projects');
        } catch (error: any) {
            console.error("Failed to create project", error);
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: error.response?.data?.message || "Could not create project.",
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/client/projects">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Post New Project</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Basic information about your project.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. E-commerce Website Development"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description" // Ideally Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detailed project description..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Total Budget ($)</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="5000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Roles Needed</h3>
                        <Button type="button" onClick={addRole} variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Role
                        </Button>
                    </div>

                    {roles.map((role, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base">Role #{index + 1}</CardTitle>
                                    {roles.length > 1 && (
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRole(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Role Title</Label>
                                    <Input
                                        value={role.title}
                                        onChange={(e) => updateRole(index, 'title', e.target.value)}
                                        placeholder="e.g. Frontend Developer"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={role.description}
                                        onChange={(e) => updateRole(index, 'description', e.target.value)}
                                        placeholder="Responsibilities for this role..."
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Allocated Budget ($)</Label>
                                    <Input
                                        type="number"
                                        value={role.salary}
                                        onChange={(e) => updateRole(index, 'salary', e.target.value)}
                                        placeholder="1000"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Required Skills (Comma separated)</Label>
                                    <Input
                                        value={role.skillsInput || ''}
                                        onChange={(e) => updateRoleSkills(index, e.target.value)}
                                        placeholder="React, CSS, HTML"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" disabled={creating} className="w-full md:w-auto">
                        {creating ? 'Submitting...' : 'Post Project'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
