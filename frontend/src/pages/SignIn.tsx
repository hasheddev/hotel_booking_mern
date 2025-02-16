import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';


export type signInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useAppContext();
    const { register, formState: { errors }, handleSubmit } = useForm<signInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({ message: "Sign in successful!", type: 'SUCCESS' });
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR' });
        },
    });

    const onSumbit = handleSubmit((data) => {
        mutation.mutate(data)
    });

    return (
        <form className='flex flex-col gap-5' onSubmit={onSumbit}>
            <h2 className='text-3xl font-bold'>Sign In</h2>
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
            <span className='flex items-center justify-between'>
                <span className='text-sm'> Not registered? <Link className='underline' to="/register">Create an account here</Link></span>
                <button type='submit' className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-400 text-xl'>Login</button>
            </span>
        </form>
    )
}

export default SignIn;
