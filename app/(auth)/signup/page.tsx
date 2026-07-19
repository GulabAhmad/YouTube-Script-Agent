import ComponentsAuthRegisterForm from '@/components/auth/signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register',
};

const SignUpPage = () => {
    return <ComponentsAuthRegisterForm />;
};

export default SignUpPage;
