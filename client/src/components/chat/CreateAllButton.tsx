import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CreateAllButton({ onCreateAll }: { onCreateAll: () => Promise<void> }) {
  const [isCreating, setIsCreating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCreateAll = async () => {
    if (isCreating || isCompleted) return;
    
    setIsCreating(true);
    try {
      await onCreateAll();
      setIsCompleted(true); // Permanently disable after success
    } catch (error) {
      // On error, allow retry by not setting isCompleted
      console.error('Create All failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isDisabled = isCreating || isCompleted;

  return (
    <Button
    size="sm"
    variant="outline"
    className="h-6 px-2 text-xs"
    onClick={handleCreateAll}
    disabled={isDisabled}
  >
    {isCompleted ? 'Created' : isCreating ? 'Creating...' : 'Create All'}
    </Button>
  );
}
