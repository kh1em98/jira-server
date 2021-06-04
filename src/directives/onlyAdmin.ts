import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { isAdmin } from '../models/User';
class OnlyAdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function (...args) {
      const [, , context] = args;

      const { currentUser } = context.user;
      if (!currentUser || !isAdmin(currentUser)) {
        return null;
      }
      return resolve.apply(this, args);
    };
  }
}

export default OnlyAdminDirective;
