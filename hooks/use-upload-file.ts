import * as React from 'react';
import type { AnyFileRoute, UploadFilesOptions } from 'uploadthing/types';
import { uploadFiles } from '@/lib/uploadthing';
import { type OurFileRouter } from '@/app/api/uploadthing/core';

interface UseUploadFileOptions<TFileRoute extends AnyFileRoute>
	extends Pick<
		UploadFilesOptions<TFileRoute>,
		'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'
	> {
	defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
	endpoint: keyof OurFileRouter,
	{
		defaultUploadedFiles = [],
		...props
	}: UseUploadFileOptions<OurFileRouter[keyof OurFileRouter]> = {}
) {
	const [uploadedFiles, setUploadedFiles] =
		React.useState<UploadedFile[]>(defaultUploadedFiles);
	const [progresses, setProgresses] = React.useState<Record<string, number>>(
		{}
	);
	const [isUploading, setIsUploading] = React.useState(false);

	async function onUpload(files: File[]) {
		setIsUploading(true);
		console.log('files', files);
		try {
			const res = await uploadFiles(endpoint, {
				...props,

				files,
				onUploadProgress: ({ file, progress }) => {
					console.log('file', file);
					setProgresses(prev => {
						return {
							...prev,
							[file.name]: progress,
						};
					});
				},
			});

			setUploadedFiles(prev => (prev ? [...prev, ...res] : res));

			return res;
		} catch (err) {
			console.log(err);
		} finally {
			setProgresses({});
			setIsUploading(false);
		}
	}

	return {
		onUpload,
		uploadedFiles,
		progresses,
		isUploading,
	};
}
