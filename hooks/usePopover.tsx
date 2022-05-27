import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

type CustomPopoverProps = {
  open: boolean;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
  message: string;
  closePopover: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

export default function CustomPopover({ open, anchorEl, message, closePopover }: CustomPopoverProps) {
  return (
    <Popover
      id="mouse-over-popover" sx={{ pointerEvents: 'none' }} open={open} anchorEl={anchorEl}
      onClose={closePopover} disableRestoreFocus
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Typography sx={{ p: 0.5 }}>{message}</Typography>
    </Popover>
  );
}

export function usePopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [message, setMessage] = useState<string>('');

  const openPopover = (event: React.MouseEvent<HTMLElement>, message: string) => {
    setAnchorEl(event.currentTarget);
    setMessage(message);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    {
      open,
      anchorEl,
      message,
      openPopover,
      closePopover,
    }
  )
}
