import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import NotificationCenter from '@/components/NotificationCenter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Bell,
  Gift,
  Clock,
  Users,
  Trophy,
  Upload,
  Wallet,
  X,
  CheckCircle,
  ClipboardCopy,
  LogOut,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import giftBox from '@/assets/gift-box.jpg';
import phonePrize from '@/assets/phone-prize.jpg';
import api from '@/lib/axios';

const Dashboard = () => {
  const [selectedPrize, setSelectedPrize] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string>('0x1234abcd5678efgh9012ijkl3456mnop7890qrst');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [entryUploadUrl, setEntryUploadUrl] = useState<string | null>(null);
  const [isUploadingEntry, setIsUploadingEntry] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<{ [prizeId: number]: 'none' | 'waiting' | 'submitted' | 'again' }>({});
  const [notifications, setNotifications] = useState<{ id?: number; title: string; message: string; createdAt: string; read?: boolean; type?: string }[]>([]);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Example crypto wallet address
  const exampleWallet = '0x1234abcd5678efgh9012ijkl3456mnop7890qrst';

  const prizes = [
    {
      id: 1,
      title: 'Mystery Gift Box',
      price: '$2',
      image: giftBox,
      participants: 1247,
      timeLeft: '2h 15m',
      description:
        'Surprise gift worth $10-50! Could be electronics, gift cards, or exclusive merchandise. Every box contains something special - perfect for trying your luck without breaking the bank.',
      features: [
        'Guaranteed value $10+',
        'Surprise element',
        'Fast shipping',
        'Perfect starter prize',
      ],
      gradient: 'from-primary to-primary-light',
    },
    {
      id: 2,
      title: 'iPhone 15 Pro',
      price: '$5',
      image: phonePrize,
      participants: 3891,
      timeLeft: '5h 42m',
      description:
        'Brand new iPhone 15 Pro 256GB in your choice of color. Unlocked and ready to use with full manufacturer warranty. This is the latest model with all premium features.',
      features: [
        '256GB Storage',
        'All colors available',
        'Factory unlocked',
        'Full warranty',
      ],
      gradient: 'from-accent to-accent/80',
    },
  ];

  const fetchParticipations = async () => {
    try {
      const response = await api.get('/api/my-participations');
      const participations = response.data.participations || [];
      const newStatus: { [prizeId: number]: 'none' | 'waiting' | 'submitted' | 'again' } = {};
      participations.forEach((p: any) => {
        if (p.submittedButton === true) {
          newStatus[p.prizeId] = 'submitted';
        } else if (p.submittedButton === false) {
          newStatus[p.prizeId] = 'again';
        } else if (p.submittedButton === null) {
          // Pending approval
          newStatus[p.prizeId] = 'waiting';
        } else {
          newStatus[p.prizeId] = 'none';
        }
      });
      setParticipationStatus(newStatus);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch participations', variant: 'destructive' }); 
    }
  };

  useEffect(() => {
    if (user) {
      fetchParticipations();
      
      // Fetch notifications only once on mount
      const fetchNotifications = async () => {
        try {
          const response = await api.get('/api/notifications');
          const notificationsData = response.data.notifications || [];
          // Add id and read status to notifications
          const enrichedNotifications = notificationsData.map((n: any, index: number) => ({
            id: n.id || index + 1,
            title: n.title,
            message: n.message,
            createdAt: n.createdAt,
            read: n.read || false,
            type: n.type || 'info'
          }));
          setNotifications(enrichedNotifications);
        } catch (err) {
          // Add some sample notifications for testing
          const sampleNotifications = [
            {
              id: 1,
              title: "Welcome to Easy Earn!",
              message: "You've successfully joined our platform. Start participating in draws to win amazing prizes!",
              createdAt: new Date().toISOString(),
              read: false,
              type: "info"
            },
            {
              id: 2,
              title: "New Prize Added",
              message: "iPhone 15 Pro has been added to today's draws. Don't miss out!",
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              read: false,
              type: "success"
            },
            {
              id: 3,
              title: "Prize Draw Result",
              message: "Yesterday's mystery gift box winner has been announced. Check if it's you!",
              createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
              read: true,
              type: "warning"
            }
          ];
          setNotifications(sampleNotifications);
        }
      };
      
      fetchNotifications();
      
      // REDUCED POLLING: Refetch participations every 30 seconds instead of 5 seconds
      const interval = setInterval(() => {
        fetchParticipations();
      }, 30000); // Changed from 5000ms to 30000ms (30 seconds)
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleParticipate = (prize: any) => {
    setSelectedPrize(prize);
  };


  // Handle file upload for Participate Now
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      setIsUploadingEntry(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      try {
        const response = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEntryUploadUrl(response.data.url);
        toast({ title: 'Receipt uploaded!', description: 'File uploaded successfully.' });
      } catch (error) {
        toast({ title: 'Upload failed', description: 'Could not upload file.', variant: 'destructive' });
        setEntryUploadUrl(null);
      } finally {
        setIsUploadingEntry(false);
      }
    }
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/api/participate', {
        prizeId: selectedPrize?.id,
        prizeTitle: selectedPrize?.title,
        walletAddress,
        receiptUrl: entryUploadUrl
      });
      // After submit, re-fetch participations to update status
      await fetchParticipations();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save participation.', variant: 'destructive' });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedPrize(null);
      setWalletAddress(exampleWallet);
      setReceipt(null);
      toast({
        title: 'Entry submitted!',
        description: `You're now entered in the ${selectedPrize.title} draw. Good luck!`,
      });
    }, 1500);
  };


  // Copy wallet address to clipboard
  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({ title: 'Copied!', description: 'Wallet address copied to clipboard.' });
  };

  // Notification handlers
  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Top Navbar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <NotificationCenter 
                notifications={notifications} 
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.username || user?.email}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Lucky Draw Notification */}
      <div className="container mx-auto px-4 py-8">
        {showNotification && (
          <Card className="mb-8 winner-glow animate-bounce-in">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-700">Welcome to Easy Earn!</h3>
                    <p className="text-muted-foreground">
                      You're now entered into our{' '}
                      <span className="font-semibold text-foreground">Daily Lucky Draw</span>{' '}
                      automatically. Earn more entries by inviting friends and completing simple
                      tasks!
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className="bg-yellow-100 text-yellow-700">Daily Prize Pool: $50</Badge>
                      <Badge className="bg-green-100 text-green-700">Entry Confirmed</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNotification(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prize Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Available Prizes</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {prizes.map((prize) => (
              <Card key={prize.id} className="lucky-card group overflow-hidden">
                <div className="relative h-64 mb-6">
                  <img
                    src={prize.image}
                    alt={prize.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${prize.gradient} opacity-20 rounded-xl`}
                  ></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {prize.timeLeft}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{prize.title}</CardTitle>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{prize.price}</div>
                      <div className="text-sm text-muted-foreground">per entry</div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {prize.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {prize.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {prize.participants.toLocaleString()} entries
                    </div>
                    <div className="text-primary font-medium">
                      Odds: 1 in {prize.participants}
                    </div>
                  </div>

                  <Dialog
                    open={selectedPrize !== null}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedPrize(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className={`w-full btn-primary text-lg ${participationStatus[prize.id] === 'submitted' || participationStatus[prize.id] === 'waiting' ? 'bg-green-500 hover:bg-green-600' : participationStatus[prize.id] === 'again' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                        onClick={() => handleParticipate(prize)}
                        disabled={participationStatus[prize.id] === 'submitted' || participationStatus[prize.id] === 'waiting'}
                      >
                        {participationStatus[prize.id] === 'waiting'
                          ? 'Waiting For Approval'
                          : participationStatus[prize.id] === 'submitted'
                          ? 'Submitted'
                          : participationStatus[prize.id] === 'again'
                          ? 'Participate Again'
                          : 'Participate Now'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Gift className="h-5 w-5 text-primary" />
                          <span>Enter Draw</span>
                        </DialogTitle>
                        <DialogDescription>
                          Complete your entry for {selectedPrize?.title}
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmitEntry} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wallet">Wallet Address</Label>
                          <div className="relative">
                            <Input
                              id="wallet"
                              placeholder="Enter your wallet address"
                              value={walletAddress}
                              readOnly
                              className="h-12 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                              onClick={handleCopyWallet}
                            >
                              <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This is your crypto wallet address for prize payout.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="receipt">Payment Receipt</Label>
                          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              id="receipt"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={isUploadingEntry}
                            />
                            <Label htmlFor="receipt" className="cursor-pointer">
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {receipt ? receipt.name : 'Click to upload receipt'}
                              </p>
                            </Label>
                            {isUploadingEntry && <div className="text-xs text-muted-foreground">Uploading...</div>}
                            {entryUploadUrl && (
                              <div className="mt-2">
                                <a href={entryUploadUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View Uploaded Receipt</a>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload proof of payment ({selectedPrize?.price})
                          </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-semibold text-foreground mb-2">Entry Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Prize:</span>
                              <span className="font-medium">{selectedPrize?.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entry Cost:</span>
                              <span className="font-medium">{selectedPrize?.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Current Entries:</span>
                              <span className="font-medium">{selectedPrize?.participants}</span>
                            </div>
                          </div>
                        </div>

                        <Button type="submit" className={`w-full btn-primary ${participationStatus[selectedPrize?.id] === 'submitted' || participationStatus[selectedPrize?.id] === 'waiting' ? 'bg-green-500 hover:bg-green-600' : participationStatus[selectedPrize?.id] === 'again' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`} disabled={isSubmitting || participationStatus[selectedPrize?.id] === 'submitted' || participationStatus[selectedPrize?.id] === 'waiting'}>
                          {participationStatus[selectedPrize?.id] === 'waiting'
                            ? 'Waiting For Approval'
                            : participationStatus[selectedPrize?.id] === 'submitted'
                            ? 'Submitted'
                            : participationStatus[selectedPrize?.id] === 'again'
                            ? 'Participate Again'
                            : isSubmitting
                            ? 'Submitting...'
                            : 'Submit Entry'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
