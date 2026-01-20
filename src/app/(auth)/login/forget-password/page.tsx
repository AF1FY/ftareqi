"use client"
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestOTP, RequestOTPSchemaType } from '@/lib/validators/auth.schema';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useContext, useState } from 'react';
import { requestOTPAsync } from '@/lib/actions/Auth.actions';
import { toast } from 'sonner';
import { userContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';

const ForgetPasswordPage = () => {
  const [isPending, setIsPending] = useState(false);
  const { updatePhoneNumber } = useContext(userContext);
  const router = useRouter();
  //* Requesting OTP
  async function handleRequestOTP(formData: RequestOTPSchemaType) {
    setIsPending(true);
    const res = await requestOTPAsync(formData.phoneNumber);
    if (res.success) {
      toast.success(res.message, {position: 'top-right', duration: 3500 });
      updatePhoneNumber(formData.phoneNumber);
      sessionStorage.setItem('phone-number', formData.phoneNumber);
      router.push('/login/otp');
    } else {
      toast.error(res.errors.at(0), { duration: 4000 });
    }
    setIsPending(false);
  }
  //* Use Form
  const form = useForm<RequestOTPSchemaType>({
    mode: 'onSubmit',
    defaultValues: {
      phoneNumber: ''
    },
    resolver: zodResolver(requestOTP)
  })

  return (
    <div className="w-full max-w-md bg-background rounded-2xl p-6 shadow-md">
      <Link href={'/login'} className='group flex items-center py-2 rounded-full w-fit transition-colors cursor-pointer decoration-0'>
        <i className="fa-solid fa-angle-left transition-transform duration-300 group-hover:-translate-x-1" />
        <span className='max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 ease-in-out'>
          <span>Back to login</span>
        </span>
      </Link>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-pale-sky text-sm md:text-base mb-4">Don't worry, happens to all of us. Enter your phone number below to recover your password</p>
      </div>

      {/* Form */}
      <Form {...form}>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md'>Phone Number</FormLabel>
                <FormControl>
                  <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='e.g. 01012345678' type='tel' {...field} />
                </FormControl>
                <FormMessage className='text-start' />
              </FormItem>
            )} />
        </div>
      </Form>

      <Button disabled={isPending} onClick={form.handleSubmit(handleRequestOTP)} type="button" className="w-full cursor-pointer mt-8 py-5 rounded-2xl dark:bg-white text-xl hover:dark:bg-white/90">
        {isPending ? <Spinner className='size-6' /> : 'Send'}
      </Button>
    </div>
  )
}

export default ForgetPasswordPage