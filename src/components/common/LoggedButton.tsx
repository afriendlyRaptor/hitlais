import { Button, type ButtonProps } from '@mui/material';
import { logAction } from '~/services';

export type LoggedButtonProps = ButtonProps & {
  /** If set, a click is logged under this id (with the label when it's plain text). */
  logId?: string;
};

/** MUI Button that can log its clicks via `logId`. */
export function LoggedButton({
  logId,
  onClick,
  children,
  ...props
}: LoggedButtonProps) {
  const handleClick: ButtonProps['onClick'] = (event) => {
    if (logId) {
      logAction(logId, {
        label: typeof children === 'string' ? children : undefined,
      });
    }
    onClick?.(event);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
