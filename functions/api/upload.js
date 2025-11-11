export async function onRequestPost(context) {
    try {
        const { request, env } = context;

        // Check if R2 bucket is bound
        if (!env.FILE_BUCKET) {
            return new Response(JSON.stringify({
                error: 'R2 bucket not configured'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file');
        const message = formData.get('message') || '';
        const slug = formData.get('slug') || '';

        if (!file) {
            return new Response(JSON.stringify({
                error: 'No file provided'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const originalName = file.name;
        const fileExtension = originalName.split('.').pop();
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const uniqueFileName = `${timestamp}_${baseName}.${fileExtension}`;

        // Prepare metadata
        const metadata = {
            originalName: originalName,
            uploadedAt: new Date().toISOString(),
            contentType: file.type || 'application/octet-stream',
            size: file.size.toString()
        };

        // Add optional fields to metadata
        if (message) {
            metadata.message = message;
        }

        if (slug) {
            metadata.slug = slug;
        }

        // Upload to R2
        await env.FILE_BUCKET.put(uniqueFileName, file, {
            httpMetadata: {
                contentType: file.type || 'application/octet-stream'
            },
            customMetadata: metadata
        });

        return new Response(JSON.stringify({
            success: true,
            filename: uniqueFileName,
            originalName: originalName
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({
            error: 'Upload failed: ' + error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
