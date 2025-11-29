"use client"
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword, ResetPassword } from '@/lib/validators/auth.schema';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

const ForgetPasswordPage = () => {
  const [isPending, setIsPending] = useState(false)

  async function handleRequestOTP(phoneNumber:ResetPassword) {
    
  }

  const form = useForm<ResetPassword>({
    mode: 'onSubmit',
    defaultValues: {
      phoneNumber: ''
    },
    resolver: zodResolver(resetPassword)
  })
  return (
    <div className="w-full max-w-md bg-background rounded-2xl p-6 shadow-md">
      <span className='flex items-center hover:underline'>
        <Link href={'/login'} className=''> <i className="fa-solid fa-angle-left"></i>Back to login</Link>
      </span>
      {/* Header */}
      <div className="my-4">
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