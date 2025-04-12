'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';

import { getReviews } from '@/lib/actions/review.actions';

import ReviewForm from '../form/review-form';
import ReviewCard from './review-card';

const ReviewList = ({
	userId,
	productId,
	productSlug,
}: {
	userId: string;
	productId: string;
	productSlug: string;
}) => {
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		const loadReviews = async () => {
			const res = await getReviews({ productId });
			setReviews(res.data);
		};

		loadReviews();
	}, [productId]);

	// Reload reviews after created or updated
	const reload = async () => {
		const res = await getReviews({ productId });
		setReviews([...res.data]);
	};

	return (
		<div className='space-y-4'>
			{reviews.length === 0 && (
				<div className='text-muted-foreground'>No reviews yet</div>
			)}
			{userId ? (
				<ReviewForm
					userId={userId}
					productId={productId}
					onReviewSubmitted={reload}
				/>
			) : (
				<div>
					Please
					<Link
						className='text-brown-50 px-2'
						href={`/sign-in?callbackUrl=/product/${productSlug}`}>
						sign in
					</Link>
					to write a review
				</div>
			)}
			<div className='flex flex-col gap-3'>
				{reviews.map(review => (
					<ReviewCard
						key={review.id}
						review={review}
						userId={userId}
						reload={reload}
					/>
				))}
			</div>
		</div>
	);
};

export default ReviewList;
