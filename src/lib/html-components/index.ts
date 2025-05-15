export function htmlBuilder({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: string;
}): string {
  return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title ?? "Sign-up / sign-in page"}</title>
            <meta name="description" content="${
              description ?? "please singup /signin first"
            }" />
            <meta name="author" content="Bagus Atok Illah" />
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            ${children}
        </body>
    </html>
`;
}
