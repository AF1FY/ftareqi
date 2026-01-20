"use client"

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import { resetPasswordDTOSchema, ResetPasswordDTOSchemaType, ResetPasswordSchemaType } from "@/lib/validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userContext } from "@/context/userContext";
import { resetPasswordAsync } from "@/lib/actions/Auth.actions";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {phoneNumber} = useContext(userContext);
  const phone = phoneNumber || sessionStorage.getItem('phone-number') || '';
  const resetToken = sessionStorage.getItem('reset-token') || '';
  const form = useForm<ResetPasswordDTOSchemaType>({
    mode: 'onSubmit',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    },
    resolver: zodResolver(resetPasswordDTOSchema)
  });

  //* Handling Reset Password
  async function handleResetPassword(formData:ResetPasswordDTOSchemaType) {
    setIsLoading(true);
    const body:ResetPasswordSchemaType = {
      password: formData.newPassword,
      phoneNumber: phone,
      resetToken
    };
    const res = await resetPasswordAsync(body);
    console.log(res);
    if(res?.success){
      toast.success(res.message , {position: 'top-right' , duration: 4000});
      sessionStorage.clear();
      router.push('/login');
    }else{
      toast.error(res.errors[0] && res.message, {position: 'top-right' , duration: 4000});
    }
    setIsLoading(false);
  }

  return (
    <form className='w-md mx-auto'>
      <div className='text-start mb-6' id="form-header">
        <strong className='text-3xl md:text-4xl' >Set a new password</strong>
        <p className='text-pale-sky mt-2'>Your previous password has been reseted. Please set a new password for your account.</p>
      </div>
      <Form {...form}  >
        <div className="flex flex-col gap-4">
          {/* //* New Password  */}
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-md ms-1'>New Password</FormLabel>
                  <FormControl>
                    <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='***********' type='password' {...field} />
                  </FormControl>
                  <FormMessage className='text-start' />
                </FormItem>
              )} />
          </div>

          {/* //* Confirm Password  */}
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-md ms-1'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='***********' type='password' {...field} />
                  </FormControl>
                  <FormMessage className='text-start' />
                </FormItem>
              )} />
          </div>
        </div>
      </Form>
      <Button disabled={isLoading} onClick={form.handleSubmit(handleResetPassword)} type="button" className="w-full cursor-pointer mt-8 py-5 rounded-2xl dark:bg-white text-xl hover:dark:bg-white/90">
        {isLoading ? <Spinner className='size-6' /> : 'Reset'}
      </Button>
    </form>
  )
}