import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import QRGenerator from '@/components/QRCode/QRGenerator';
import Spinner from '@/components/ui/Spinner';

interface EventFormData {
  name: string;
  date: string;
  description: string;
  numberOfTokens: number;
}

const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    defaultValues: {
      name: '',
      date: '',
      description: '',
      numberOfTokens: 100,
    },
  });

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    setIsLoading(true);

    try {
      // Simulate minting tokens
      await new Promise(resolve => setTimeout(resolve, 2000));

      setEventData(data);
      setEventCreated(true);

      toast({
        title: "Event Created Successfully",
        description: `Created ${data.numberOfTokens} tokens for "${data.name}"`,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Failed to Create Event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRValue = () => {
    if (!eventData) return '';

    // Create a data representation for the QR code
    const qrData = {
      eventId: `event-${Date.now().toString(36)}`,
      name: eventData.name,
      date: eventData.date,
      description: eventData.description,
    };

    return JSON.stringify(qrData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

      {!eventCreated ? (
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill out the details of your event to mint compressed proof-of-participation tokens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Event name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter event name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  rules={{ required: "Event date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Event description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter event description"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfTokens"
                  rules={{
                    required: "Number of tokens is required",
                    min: { value: 1, message: "Must be at least 1 token" },
                    max: { value: 1000, message: "Cannot exceed 1000 tokens" },
                  }}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Number of Tokens</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="1000"
                          value={value}
                          onChange={(e) => onChange(parseInt(e.target.value, 10) || 1)}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Spinner size="small" />
                      <span className="ml-2">Minting Tokens...</span>
                    </div>
                  ) : "Mint cTokens"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Event Created Successfully</CardTitle>
            <CardDescription>
              Share this QR code with your attendees to let them claim their tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold">{eventData?.name}</h2>
              <p className="text-gray-500">{eventData?.date}</p>
            </div>

            <QRGenerator value={generateQRValue()} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                The QR code contains all the event information needed for attendees to claim their tokens.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateEvent;
