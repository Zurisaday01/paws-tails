import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import ReviewForm from '../form/review-form';

interface ReviewsActionsProps {
	review: Review;
	onDelete: () => void;
	reload: () => void;
}

const ReviewsActions = ({ review, onDelete, reload }: ReviewsActionsProps) => {
	return (
		<>
			<div className='flex gap-2'>
				<ReviewForm
					userId={review.userId}
					productId={review.productId}
					onReviewSubmitted={reload}
					review={review}
				/>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='destructive'>
							<Trash2 className='h-4 w-4' />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								review.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</>
	);
};
export default ReviewsActions;
