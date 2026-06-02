import {Alert} from 'flowbite-react'

export default function AlertSuccess({message}, isSuccesss) {
  return (
    <Alert color="success" onDismiss={() => isSuccesss.isSuccess(false) }>
      <span className="font-medium">Success</span> {message}
    </Alert>
  );
}
