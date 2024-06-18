import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import * as apiClient from '../api-client'
import { useAppContext } from '../contexts/AppContext';


export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

//md medium screen size

const Register = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({ message: "Registration Success!", type: 'SUCCESS' });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR' });
        },
    });

    const onSumbit = handleSubmit((data) => {
        mutation.mutate(data)
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSumbit}>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className='text-gray-700 text-sm font-bold flex-1'>First Name
                    <input className='border rounded w-full py-1 px-2 font-normal' {...register("firstName", { required: "This field is required" })} />
                    {errors.firstName && (<span className='text-red-500'>
                        {errors.firstName.message}
                    </span>)}
                </label>
                <label className='text-gray-700 text-sm font-bold flex-1'>Last Name
                    <input className='border rounded w-full py-1 px-2 font-normal' {...register("lastName", { required: "This field is required" })} />
                    {errors.lastName && (<span className='text-red-500'>
                        {errors.lastName.message}
                    </span>)}
                </label>
            </div>
            <label className='text-gray-700 text-sm font-bold flex-1'>Email
                <input type='email' className='border rounded w-full py-1 px-2 font-normal' {...register("email", { required: "This field is required" })} />
                {errors.email && (<span className='text-red-500'>
                    {errors.email.message}
                </span>)}
            </label>
            <label className='text-gray-700 text-sm font-bold flex-1'>Password
                <input type='password' className='border rounded w-full py-1 px-2 font-normal' {...register("password", { required: "This field is required", minLength: { value: 6, message: 'password must be 6 characters or more' } })} />
                {errors.password && (<span className='text-red-500'>
                    {errors.password.message}
                </span>)}
            </label>
            <label className='text-gray-700 text-sm font-bold flex-1'>Comfirm Password
                <input type='password' className='border rounded w-full py-1 px-2 font-normal' {...register("confirmPassword", {
                    required: "This field is required", validate: (val) => {
                        if (!val) {
                            return 'This field is required';
                        } else if (watch('password') !== val) {
                            return "your password do not match";
                        }
                    }
                })} />
                {errors.confirmPassword && (<span className='text-red-500'>
                    {errors.confirmPassword.message}
                </span>)}
            </label>
            <span>
                <button type='submit' className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-400 text-xl'>Create Account</button>
            </span>
        </form>
    )
}

export default Register;
