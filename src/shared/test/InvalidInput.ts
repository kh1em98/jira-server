import { gCall } from './../../test-utils/gCall';

export const invalidEmailInputTest = ({
	source,
	otherFieldsInput,
}: {
	source: string;
	otherFieldsInput: any;
}) => {
	describe('test invalid email', () => {
		test('not allow user to enter invalid email', async () => {
			const invalidEmail: string = 'khiem';
			const response = await gCall({
				source,
				variableValues: {
					input: {
						...otherFieldsInput,
						email: invalidEmail,
					},
				},
			});

			expect(response.errors![0]).toMatchObject({
				message: 'Argument Validation Error',
			});
		});
	});
};
