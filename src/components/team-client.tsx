"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Crown,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_at: string;
  joined_at?: string;
  permissions: any;
}

interface TeamClientProps {
  user: any;
}

export default function TeamClient({ user }: TeamClientProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const roles = [
    { value: "admin", label: "Admin", icon: Crown, description: "Full access to all features" },
    { value: "editor", label: "Editor", icon: Edit, description: "Can create and edit content" },
    { value: "viewer", label: "Viewer", icon: Eye, description: "Can view content and analytics" },
  ];

  const permissions = {
    admin: ["create_posts", "edit_posts", "delete_posts", "manage_team", "view_analytics", "manage_settings"],
    editor: ["create_posts", "edit_posts", "view_analytics"],
    viewer: ["view_analytics"],
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          user_id: user.id,
          email: inviteEmail,
          role: inviteRole,
          status: 'pending',
          invited_by: user.id,
          permissions: permissions[inviteRole as keyof typeof permissions],
        });

      if (error) throw error;

      setInviteEmail("");
      setInviteRole("viewer");
      setInviteOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error inviting team member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.icon || Shield;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-red-600';
    }
  };

  const stats = [
    { title: "Total Members", value: teamMembers.length + 1, icon: Users, color: "text-blue-400" },
    { title: "Active Members", value: teamMembers.filter(m => m.status === 'active').length + 1, icon: CheckCircle, color: "text-green-400" },
    { title: "Pending Invites", value: teamMembers.filter(m => m.status === 'pending').length, icon: Clock, color: "text-yellow-400" },
    { title: "Admin Users", value: teamMembers.filter(m => m.role === 'admin').length + 1, icon: Crown, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 text-sm">Manage your team members and their permissions</p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-200 mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200 mb-2 block">Role</label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value} className="text-white">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-slate-400">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleInvite}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setInviteOpen(false)}
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-300 text-sm">{stat.title}</CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team Members */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current User */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.user_metadata.full_name
                      ? user.user_metadata.full_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                      : user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{user.user_metadata.full_name || "You"}</h3>
                    <Badge className="bg-purple-600 text-white">Owner</Badge>
                  </div>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
            </div>

            {/* Team Members */}
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading team members...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No team members yet</p>
                <Button 
                  onClick={() => setInviteOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Your First Team Member
                </Button>
              </div>
            ) : (
              teamMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                const StatusIcon = getStatusIcon(member.status);
                const statusColor = getStatusColor(member.status);
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-slate-600 text-white">
                          {member.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{member.email}</h3>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">
                          Invited {new Date(member.invited_at).toLocaleDateString()}
                          {member.joined_at && ` • Joined ${new Date(member.joined_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColor} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {member.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveMember(member.id)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const rolePermissions = permissions[role.value as keyof typeof permissions];
              
              return (
                <div key={role.value} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-medium">{role.label}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{role.description}</p>
                  <div className="space-y-1">
                    {rolePermissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}