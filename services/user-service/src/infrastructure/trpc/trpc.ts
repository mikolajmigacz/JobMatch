import { initTRPC, TRPCError } from '@trpc/server';
import { UserRole } from '@jobmatch/shared';
import { AUTH_ERRORS } from './constants';

export interface Context {
  userId?: string;
  role?: UserRole;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: AUTH_ERRORS.NOT_AUTHENTICATED });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      role: ctx.role,
    },
  });
});

const isEmployer = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: AUTH_ERRORS.NOT_AUTHENTICATED });
  }
  if (ctx.role !== 'employer') {
    throw new TRPCError({ code: 'FORBIDDEN', message: AUTH_ERRORS.EMPLOYER_ACCESS_REQUIRED });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      role: ctx.role,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const employerProcedure = t.procedure.use(isEmployer);
