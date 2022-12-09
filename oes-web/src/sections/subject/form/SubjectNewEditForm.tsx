import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

type Props = {
  currentSubject: any;
  isEdit: boolean;
};

export default function SubjectNewEditForm({ currentSubject, isEdit }: Props) {
  const SubjectSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    code: currentSubject?.code || '',
    name: currentSubject?.name || '',
  };

  const methods = useForm({
    resolver: yupResolver(SubjectSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    //
  };

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="code" label="Code" />
            <RHFTextField name="name" label="Name" />
          </Stack>
          <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              {isEdit ? 'Save' : 'Create'}
            </LoadingButton>
          </Stack>
        </Card>
      </FormProvider>
    </>
  );
}
