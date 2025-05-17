import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { useMerkleTree } from "@/hooks/useMerkleTree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useWalletContext } from "@/context/WalletContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters" }),
  description: z.string().optional(),
  date: z.date({
    required_error: "Event date is required",
  }),
});

export default function EventForm() {
  const { connected } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { loading: csvLoading, parseCSV, merkleData } = useMerkleTree();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: undefined, // Add this to trigger date validation properly
    },
  });

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      });
      return;
    }

    parseCSV(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!merkleData) {
      toast({
        variant: "destructive",
        title: "Missing data",
        description: "Please upload a CSV file with wallet addresses",
      });
      return;
    }

    if (!connected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create an event",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockEventId = "evt_" + Math.random().toString(36).substring(2, 10);

      setShareableLink(`${window.location.origin}/event/${mockEventId}`);
      setIsSuccess(true);

      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is ready to share",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Failed to create event",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isSuccess ? (
        <div className="text-center p-6 rounded-lg border border-white/10 bg-zkpurple/20 backdrop-blur-lg">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-zkpurple/30 mx-auto flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zkneon-green"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Event Created!</h3>
            <p className="text-gray-300 mb-4">
              Your event has been created successfully. Share the link below with
              your attendees.
            </p>
          </div>

          <div className="flex items-center mb-6 max-w-lg mx-auto">
            <Input
              value={shareableLink}
              readOnly
              className="bg-black/30 border-white/10"
            />
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                navigator.clipboard.writeText(shareableLink);
                toast({
                  title: "Link copied!",
                  description: "The event link has been copied to your clipboard",
                });
              }}
            >
              Copy
            </Button>
          </div>

          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="mr-2"
          >
            Create Another
          </Button>
          <Button onClick={() => window.open(shareableLink, "_blank")}>
            View Event
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and descriptive name for your event.
                  </FormDescription>
                  <FormMessage /> {/* Displays name validation errors */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide details about your event.</FormDescription>
                  <FormMessage /> {/* Optional field, usually no error */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal border-white/20",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When will your event take place?</FormDescription>
                  <FormMessage /> {/* Shows "Event date is required" if empty */}
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Upload Attendee List (CSV)</FormLabel>
              <div className="flex items-center">
                <label
                  htmlFor="csv-upload"
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center rounded-md border border-dashed border-white/20 px-6 py-8",
                    merkleData
                      ? "border-zkneon-green/50 bg-zkneon-green/5"
                      : "bg-black/20"
                  )}
                >
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <Upload
                      className={merkleData ? "text-zkneon-green" : "text-gray-400"}
                      size={28}
                    />
                    <div className="text-sm font-medium">
                      {csvLoading
                        ? "Processing..."
                        : merkleData
                        ? `${merkleData.addressCount} addresses loaded`
                        : "Click to upload CSV file"}
                    </div>
                    <div className="text-xs text-gray-500">One wallet address per line</div>
                  </div>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  disabled={csvLoading}
                />
              </div>
              {merkleData && (
                <div className="text-xs text-gray-400 break-all">
                  <span className="font-semibold text-zkneon-green">Merkle Root:</span>{" "}
                  {merkleData.merkleRoot}
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-zkpurple hover:bg-zkpurple-dark"
                disabled={isSubmitting || !merkleData || csvLoading}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
              {!connected && (
                <div className="mt-2 text-xs text-center text-amber-400">
                  Please connect your wallet to create an event
                </div>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
