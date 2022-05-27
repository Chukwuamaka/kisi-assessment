import Typography from '@mui/material/Typography';

type IconPopoverWrapperProps = {
  children: React.ReactNode;
  open: boolean;
  message: string;
  closePopover: (event: React.MouseEvent<HTMLElement>) => void;
  openPopover: (event: React.MouseEvent<HTMLElement>, message: string) => void
}

export default function IconPopoverWrapper({ children, open, message, closePopover, openPopover }: IconPopoverWrapperProps) {
  return (
    <Typography component='span' aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true" onMouseLeave={closePopover}
      onMouseEnter={(event: React.MouseEvent<HTMLElement>) => openPopover(event, message)}
    >
      {children}
    </Typography>
  )
}
