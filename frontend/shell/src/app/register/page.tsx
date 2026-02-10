'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import {
  RegisterDtoSchema,
  type RegisterRequest,
  type JobSeekerRegister,
  type EmployerRegister,
} from '@jobmatch/shared';
import {
  PageContainer,
  FormCard,
  Title,
  Form,
  Input,
  ErrorText,
  SubmitButton,
  LinkText,
  RoleSelector,
  RoleOption,
  Label,
  FileInput,
} from './register.styles';

type RegisterFormData = (JobSeekerRegister | EmployerRegister) & { companyName?: string };

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, isAuthenticated, user } = useAuth();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(user.role === 'employer' ? '/employer' : '/job-seeker');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (!isLoading && isAuthenticated) return null;

  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterDtoSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'job_seeker',
      companyName: '',
    },
  });

  const role = watch('role');
  const isEmployer = role === 'employer';

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const payload: RegisterRequest =
        data.role === 'job_seeker'
          ? { email: data.email, password: data.password, name: data.name, role: 'job_seeker' }
          : {
              email: data.email,
              password: data.password,
              name: data.name,
              role: 'employer',
              companyName: data.companyName!,
            };
      const { user } = await registerUser(payload, isEmployer && logoFile ? logoFile : undefined);
      router.push(user.role === 'employer' ? '/employer' : '/job-seeker');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Registration failed' });
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <Title>Register</Title>
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
              autoComplete="new-password"
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </div>
          <div>
            <Input
              {...registerField('name')}
              type="text"
              placeholder="Full Name"
              autoComplete="name"
            />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </div>

          <div>
            <Label>Role</Label>
            <RoleSelector>
              <RoleOption
                $active={role === 'job_seeker'}
                type="button"
                onClick={() => setValue('role', 'job_seeker')}
              >
                Job Seeker
              </RoleOption>
              <RoleOption
                $active={role === 'employer'}
                type="button"
                onClick={() => setValue('role', 'employer')}
              >
                Employer
              </RoleOption>
            </RoleSelector>
          </div>

          {isEmployer && (
            <>
              <div>
                <Input
                  {...registerField('companyName')}
                  type="text"
                  placeholder="Company Name"
                />
                {errors.companyName && (
                  <ErrorText>{errors.companyName.message}</ErrorText>
                )}
              </div>
              <div>
                <Label>Company Logo (optional)</Label>
                <FileInput
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </>
          )}

          {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </SubmitButton>
          <LinkText>
            Already have an account? <Link href="/login">Login</Link>
          </LinkText>
        </Form>
      </FormCard>
    </PageContainer>
  );
}
