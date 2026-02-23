'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import { LoginDtoSchema, type LoginRequest } from '@jobmatch/shared';
import {
  PageContainer,
  FormCard,
  Title,
  Form,
  Input,
  ErrorText,
  SubmitButton,
  LinkText,
} from './login.styles';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(user.role === 'employer' ? '/employer' : '/job-seeker');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginDtoSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && isAuthenticated) return null;

  const onSubmit = async (data: LoginRequest) => {
    try {
      const { user } = await login(data);
      router.push(user.role === 'employer' ? '/employer' : '/job-seeker');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Login failed' });
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...registerField('email')}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </div>
          <div>
            <Input
              {...registerField('password')}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </div>
          {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
          <LinkText>
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </LinkText>
        </Form>
      </FormCard>
    </PageContainer>
  );
}
