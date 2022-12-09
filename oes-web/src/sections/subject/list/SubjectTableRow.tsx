import { TableCell, TableRow, Typography } from '@mui/material';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function SubjectTableRow({ row, onRowClick }: Props) {
  const { code, name } = row;

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name}</TableCell>
    </TableRow>
  );
}
