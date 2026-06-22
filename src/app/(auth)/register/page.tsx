"use client"
import { useContext, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { mapToRegistration, registerSchema, RegisterSchemaType } from '@/lib/validators/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner"
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { userContext } from '@/context/userContext';
import { registerUser } from '@/lib/actions/Auth.actions';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FemaleIcon } from '@/components/svg/FemaleIcon';
import { MaleIcon } from '@/components/svg/MaleIcon';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { PassengerIcon } from '@/components/svg/PassengerIcon';
import { DriverIcon } from '@/components/svg/DriverIcon';

const Register = () => {
  const [isPending, setIsPending] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { updatePhoneNumber , updateRole } = useContext(userContext);
  const maxDate = new Date();
  const router = useRouter()
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  //* Form
  const form = useForm<RegisterSchemaType>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: 'Ahmed Hisham',
      phoneNumber: '01121276769',
      password: 'User@123',
      gender: 1,
      role: 1,
    },
    resolver: zodResolver(registerSchema)
  })

  //* Registration
  async function handleRegister(user: RegisterSchemaType) {
    console.log(user);
    
    setIsPending(true);
    try {
      const res = await registerUser(mapToRegistration(user))
      console.log(res);

      if (res.success) {
        toast.success(res.message, { duration: 7000, position: 'top-right' });
        updatePhoneNumber(user.phoneNumber);
        sessionStorage.setItem('phone-number',user.phoneNumber);
        updateRole(user.role);
        router.push('/verify');
      }
      else {
        if (res.errors.length !== 0) {
          form.setError('phoneNumber', {
            message: res.errors.at(0)
          })
          form.setFocus('phoneNumber')
        }
        else
          toast.error(res.message, { duration: 6000, position: 'top-right' });
      }
    } catch (e) {
      console.log("Error : ", e);
      toast.error("An unexpected error occurred", { duration: 3000, position: 'top-right' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className='w-lg mx-auto'>
      <div className='text-start mb-6' id="form-header">
        <strong className='text-3xl md:text-4xl' >Create Account</strong>
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-md'>Phone Number</FormLabel>
                  <FormControl>
                    {/* <Input className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray' placeholder='e.g. 01012345678' type='tel' {...field} />
                     */}
                    <InputGroup className='bg-porcelain rounded-2xl focus-visible:ring-2 focus-visible:ring-lavender-gray overflow-hidden'>
                      <InputGroupInput placeholder='e.g. 01012345678' type='tel' {...field} />
                      <InputGroupAddon className='h-full pe-2 border-e border-e-lavender-gray text-foreground'>
                        +20
                      </InputGroupAddon>
                    </InputGroup>
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
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md'>Gender</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    className="grid grid-cols-2 w-full"
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(Number(value));
                      }
                    }}
                  >
                    <ToggleGroupItem
                      value="1"
                      aria-label="Male"
                      className="h-auto data-[state=on]:bg-foreground dark:data-[state=on]:bg-foreground data-[state=on]:text-background cursor-pointer bg-porcelain rounded-2xl"
                    >
                      <div className="flex items-center justify-center p-3 gap-2">
                        <MaleIcon className='size-5' />
                        <span className="text-sm font-medium text-start">Male</span>
                      </div>
                    </ToggleGroupItem>

                    <ToggleGroupItem
                      value="2"
                      aria-label="Female"
                      className="h-auto data-[state=on]:bg-foreground dark:data-[state=on]:bg-foreground data-[state=on]:text-background cursor-pointer bg-porcelain rounded-2xl"
                    >
                      <div className="flex items-center justify-center p-3 gap-2">
                        <FemaleIcon className='size-5' />
                        <span className="text-sm font-medium text-start">Female</span>
                      </div>
                    </ToggleGroupItem>

                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //* Role  */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md'>I want to</FormLabel>
                <FormControl>
                  <ToggleGroup
                    className='grid grid-cols-2 w-full'
                    type='single'
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(Number(value));
                      }
                    }}
                  >
                    <ToggleGroupItem value='1' className='h-auto data-[state=on]:bg-foreground dark:data-[state=on]:bg-foreground data-[state=on]:text-background cursor-pointer bg-porcelain rounded-2xl'>
                      <div className="flex items-center justify-center p-3 gap-2">
                        <PassengerIcon className='size-7' />
                        <span>Find Rides<br />
                          (Passenger)</span>
                      </div>
                    </ToggleGroupItem>

                    <ToggleGroupItem value='2' className='h-auto data-[state=on]:bg-foreground dark:data-[state=on]:bg-foreground data-[state=on]:text-background cursor-pointer bg-porcelain rounded-2xl'>
                      <div className="flex items-center justify-center p-3 gap-2">
                        <DriverIcon className='size-8' />
                        <span>Offer Rides<br/>
                          (Driver)</span>
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
      <Button disabled={isPending} onClick={form.handleSubmit(handleRegister)} type="button" className="w-full cursor-pointer mt-8 py-5 rounded-2xl dark:bg-white text-xl hover:dark:bg-white/90">
        {isPending ? <Spinner className='size-6' /> : 'Join us'}
      </Button>
    </form>
  )
}

export default Register