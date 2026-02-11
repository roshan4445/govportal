import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Send, User, MapPin, Phone, Mail } from 'lucide-react';

const complaintSchema = z.object({
  Full_Name: z.string().min(2, 'Full name must be at least 2 characters'),
  Address: z.string().min(10, 'Please provide a complete address'),
  Contact_Number: z.string().min(10, 'Please provide a valid contact number'),
  Email_Address: z.string().email('Please provide a valid email address'),
  Complaint_Title: z.string().min(5, 'Title must be at least 5 characters'),
  Detailed_Description: z.string().min(20, 'Description must be at least 20 characters'),
  Category: z.string().min(1, 'Please select a category'),
  Incident_Location: z.string().min(5, 'Please provide the incident location'),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

const categories = [
  'Public Infrastructure',
  'Traffic & Transportation',
  'Water Supply',
  'Electricity',
  'Sanitation',
  'Healthcare',
  'Education',
  'Corruption',
  'Other',
];

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      Full_Name: '',
      Address: '',
      Contact_Number: '',
      Email_Address: '',
      Complaint_Title: '',
      Detailed_Description: '',
      Category: '',
      Incident_Location: '',
    },
  });

  // const onSubmit = async (data: ComplaintFormData) => {
  //   setIsSubmitting(true);
    
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 2000));
    
  //   const complaintId = `CPL${Date.now().toString().slice(-6)}`;
    
  //   toast.success(`Complaint submitted successfully! Reference ID: ${complaintId}`, {
  //     description: 'You will receive updates via email and SMS.',
  //   });
    
  //   form.reset();
  //   setIsSubmitting(false);
  // };
//   const onSubmit = async (data: ComplaintFormData) => {
//   setIsSubmitting(true);

//   try {
//     const response = await fetch('http://localhost:3000/complaint_user', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data), // Use the same keys as in the form state
//     });

//     const result = await response.json();

//     if (response.ok) {
//       const complaintId = result.complaintId || `CPL${Date.now().toString().slice(-6)}`;
//       toast.success(`Complaint submitted successfully! Reference ID: ${complaintId}`, {
//         description: 'You will receive updates via Email and SMS.',
//       });
//       form.reset();
//     } else {
//       toast.error('Submission failed', {
//         description: result.message || 'Something went wrong.',
//       });
//     }
//   } catch (error) {
//     console.error('Submission Error:', error);
//     toast.error('Network error occurred');
//   } finally {
//     setIsSubmitting(false);
//   }
// };
const onSubmit = async (data: ComplaintFormData) => {
  setIsSubmitting(true);
  // if needed

  try {
    const response = await fetch('http://localhost:3000/complaint_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data// Optional if you're tracking by user
      }),
    });

    const result = await response.json();

    if (response.ok && result.succeeded) {
      const complaintId = `CPL${Date.now().toString().slice(-6)}`;
      toast.success(`Complaint submitted successfully! Reference ID: ${complaintId}`, {
        description: 'You will receive updates via Email and SMS.',
      });
      form.reset();
    } else {
      toast.error('Submission failed', {
        description: result.message || 'Something went wrong.',
      });
    }
  } catch (error) {
    console.error('Submission Error:', error);
    toast.error('Network error occurred');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Complaint Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Full_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Contact_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Email_Address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select complaint category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="Address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete address"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Complaint Information */}
              <FormField
                control={form.control}
                name="Complaint_Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complaint Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title describing your complaint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Incident_Location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Where did this incident occur?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Detailed_Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed information about your complaint"
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Complaint
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ComplaintForm;