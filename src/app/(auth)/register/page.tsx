"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import signup_image from '@/assets/signup_image.png';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useForm } from 'react-hook-form';
import { registerSchema, RegisterSchemaType } from '@/lib/validators/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Typewriter from 'typewriter-effect';
const Register = () => {
  const [isPending, setIsPending] = useState(false)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  function register(formData: RegisterSchemaType) {
    console.log(formData);

  }

  const form = useForm<RegisterSchemaType>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: '',
      phone: '',
      password: '',
      gender: 'male',
      role: 'passenger'
    },
    resolver: zodResolver(registerSchema)
  })
  return (
    <div className='bg-[#fbfcff] dark:bg-background min-h-screen pt-[100px] flex items-center'>
      <div className='container flex flex-col md:flex-row items-center text-center xl:gap-16 justify-center'>
        <picture className='order-2 md:order-1'>
          <Image src={signup_image} alt='carpooling' />
        </picture>
        <form className='order-1 w-1/3'>
          <div className='text-start mb-6' id="form-header">
            <strong className='text-3xl' >Create Account</strong>
            <p className='text-pale-sky mt-2'>Join our community of carpoolers and start sharing rides today.</p>
          </div>
          <Form {...form}  >
            <div className="flex flex-col gap-4">
              {/*//* Full Name  */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-md'>Full Name</FormLabel>
                      <FormControl>
                        <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='e.g. Ibn Battuta' type='text' {...field} />
                      </FormControl>
                      <FormMessage className='text-start' />
                    </FormItem>
                  )} />
              </div>

              {/* //* Phone Number  */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="phone"
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

              {/* //* Password  */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-md'>Password</FormLabel>
                      <FormControl>
                        <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='***********' type='password' {...field} />
                      </FormControl>
                      <FormMessage className='text-start' />
                    </FormItem>
                  )} />
              </div>

              {/* //* Date of Birth  */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className='text-md'>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-porcelain",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Feb 24, 1999</span>
                              )}
                              <i className="fa-solid fa-calendar-days ml-auto mr-2 h-4 w-4"></i>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > maxDate || date < new Date("1900-01-01")
                            }
                            defaultMonth={maxDate}
                            captionLayout='dropdown'
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-start' />
                    </FormItem>
                  )}
                />
              </div>

              {/* //* Gender  */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-md'>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                        >
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem className='cursor-pointer accent-amber-300' value="male" />
                            </FormControl>
                            <FormLabel className="font-normal text-md cursor-pointer">
                              Male
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem className='cursor-pointer' value="female" />
                            </FormControl>
                            <FormLabel className="font-normal text-md cursor-pointer">
                              Female
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* //* User's Role  */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-md'>I want to</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        className="grid grid-cols-2 w-full"
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                      >
                        <ToggleGroupItem
                          value="passenger"
                          aria-label="Select passenger"
                          className="h-auto data-[state=on]:bg-lavender-gray dark:data-[state=on]:bg-lavender-gray/30 cursor-pointer bg-porcelain rounded-2xl"
                        >
                          <div className="flex items-center justify-center p-3 gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" className='size-6 dark:fill-white' xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.23218 23.7222V17.8889H7.14884V23.7222H4.23218ZM9.09329 23.7222V12.1528C8.2831 12.4282 7.75648 12.9346 7.51343 13.6719C7.27037 14.4092 7.14884 15.1667 7.14884 15.9445H5.2044C5.2044 13.8704 5.81204 12.2176 7.02732 10.9861C8.24259 9.75464 9.90347 9.1389 12.01 9.1389C13.6303 9.1389 14.8456 8.73785 15.6558 7.93577C16.466 7.13369 16.8711 5.91436 16.8711 4.27778H18.8155C18.8155 5.70371 18.5117 6.97975 17.9041 8.10591C17.2964 9.23207 16.3039 10.0301 14.9266 10.5V23.7222H12.9822V17.8889H11.0377V23.7222H9.09329ZM12.01 8.16667C11.4752 8.16667 11.0175 7.97628 10.6367 7.59549C10.2559 7.21471 10.0655 6.75695 10.0655 6.22223C10.0655 5.68751 10.2559 5.22975 10.6367 4.84896C11.0175 4.46818 11.4752 4.27778 12.01 4.27778C12.5447 4.27778 13.0024 4.46818 13.3832 4.84896C13.764 5.22975 13.9544 5.68751 13.9544 6.22223C13.9544 6.75695 13.764 7.21471 13.3832 7.59549C13.0024 7.97628 12.5447 8.16667 12.01 8.16667Z" />
                            </svg>
                            <span className="text-sm font-medium text-start">Find Rides <br /> (Passenger)</span>
                          </div>
                        </ToggleGroupItem>

                        <ToggleGroupItem
                          value="driver"
                          aria-label="Select driver"
                          className="h-auto data-[state=on]:bg-lavender-gray dark:data-[state=on]:bg-lavender-gray/30 cursor-pointer bg-porcelain rounded-2xl"
                        >
                          <div className="flex items-center justify-center p-3 gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" className='size-6 dark:fill-white' xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.17668 20.8056V21.7778C6.17668 22.0532 6.08351 22.2841 5.89716 22.4705C5.71082 22.6568 5.47992 22.75 5.20445 22.75H4.23223C3.95677 22.75 3.72587 22.6568 3.53952 22.4705C3.35318 22.2841 3.26001 22.0532 3.26001 21.7778V14L5.30168 8.16667C5.3989 7.875 5.57309 7.64005 5.82425 7.46181C6.0754 7.28356 6.35492 7.19444 6.66279 7.19444H17.3572C17.6651 7.19444 17.9446 7.28356 18.1958 7.46181C18.4469 7.64005 18.6211 7.875 18.7183 8.16667L20.76 14V21.7778C20.76 22.0532 20.6668 22.2841 20.4805 22.4705C20.2942 22.6568 20.0633 22.75 19.7878 22.75H18.8156C18.5401 22.75 18.3092 22.6568 18.1229 22.4705C17.9365 22.2841 17.8433 22.0532 17.8433 21.7778V20.8056H6.17668ZM5.98223 12.0556H18.0378L17.017 9.13889H7.00307L5.98223 12.0556ZM7.63501 17.8889C8.0401 17.8889 8.38443 17.7471 8.668 17.4635C8.95156 17.18 9.09334 16.8356 9.09334 16.4306C9.09334 16.0255 8.95156 15.6811 8.668 15.3976C8.38443 15.114 8.0401 14.9722 7.63501 14.9722C7.22992 14.9722 6.88559 15.114 6.60202 15.3976C6.31846 15.6811 6.17668 16.0255 6.17668 16.4306C6.17668 16.8356 6.31846 17.18 6.60202 17.4635C6.88559 17.7471 7.22992 17.8889 7.63501 17.8889ZM16.385 17.8889C16.7901 17.8889 17.1344 17.7471 17.418 17.4635C17.7016 17.18 17.8433 16.8356 17.8433 16.4306C17.8433 16.0255 17.7016 15.6811 17.418 15.3976C17.1344 15.114 16.7901 14.9722 16.385 14.9722C15.9799 14.9722 15.6356 15.114 15.352 15.3976C15.0685 15.6811 14.9267 16.0255 14.9267 16.4306C14.9267 16.8356 15.0685 17.18 15.352 17.4635C15.6356 17.7471 15.9799 17.8889 16.385 17.8889ZM5.20445 18.8611H18.8156V14H5.20445V18.8611Z" />
                            </svg>
                            <span className="text-sm font-medium text-start">Offer Rides <br /> (Driver)</span>
                          </div>
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </Form>
          <Button disabled={isPending} onClick={form.handleSubmit(register)} type="button" className="w-full cursor-pointer mt-6 rounded-2xl dark:bg-white text-md hover:dark:bg-white/90">
            {isPending ? <span className="loading loading-dots loading-md"></span> : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register