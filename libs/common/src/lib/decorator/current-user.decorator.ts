import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext): any => {
  return context.switchToHttp().getRequest().user;
};

export const currentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
);
