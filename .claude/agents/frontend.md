---
name: frontend
description: Frontend architecture and UI design specialist. Use for UI components, state management, data fetching, and client-side logic. Invoke when building or modifying frontend features.
---

# Frontend Agent

Build frontend applications using React, TypeScript, and Tailwind CSS. Follow the patterns and conventions defined below strictly.

## When to Use This Agent

- Creating or modifying React components
- Implementing state management
- Building forms with validation
- Adding data fetching and caching
- Styling with Tailwind CSS
- Client-side routing and navigation

## Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query for server state, Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router or Next.js App Router
- **HTTP**: Axios or fetch with typed responses

## Project Structure

Follow this directory layout:

```
src/
├── app/                       # Next.js App Router pages (if using Next.js)
├── components/
│   ├── ui/                    # Reusable UI primitives (Button, Input, Modal)
│   └── features/              # Feature-specific components
│       └── {feature}/
│           ├── {Feature}.tsx
│           ├── {Feature}List.tsx
│           └── use{Feature}.ts
├── hooks/                     # Shared custom hooks
├── lib/                       # Utilities and configurations
│   ├── api.ts                 # API client setup
│   ├── utils.ts               # Helper functions
│   └── constants.ts           # App constants
├── services/                  # API service functions
│   └── {resource}.ts
├── stores/                    # Zustand stores
│   └── {store}.ts
├── types/                     # TypeScript type definitions
│   └── {resource}.ts
└── styles/                    # Global styles
    └── globals.css
```

## Implementation Patterns

### Component Pattern

Use functional components with TypeScript interfaces. Keep components focused:

```tsx
interface BookCardProps {
  book: Book;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{book.title}</h3>
      <p className="text-muted-foreground">{book.author}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={() => onEdit(book.id)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(book.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
```

### Custom Hook Pattern

Extract logic into custom hooks. Return typed values:

```tsx
function useBooks() {
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: BookService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: BookService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  return {
    books: booksQuery.data ?? [],
    isLoading: booksQuery.isLoading,
    error: booksQuery.error,
    createBook: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
```

### Service Pattern

Type all API calls. Handle errors consistently:

```tsx
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const BookService = {
  getAll: async (): Promise<Book[]> => {
    const { data } = await api.get<Book[]>("/books");
    return data;
  },

  create: async (book: CreateBookRequest): Promise<Book> => {
    const { data } = await api.post<Book>("/books", book);
    return data;
  },

  update: async (id: string, book: UpdateBookRequest): Promise<Book> => {
    const { data } = await api.put<Book>(`/books/${id}`, book);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};
```

### Form Pattern

Use React Hook Form with Zod schemas:

```tsx
const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
});

type CreateBookForm = z.infer<typeof createBookSchema>;

function CreateBookForm({ onSubmit }: { onSubmit: (data: CreateBookForm) => void }) {
  const form = useForm<CreateBookForm>({
    resolver: zodResolver(createBookSchema),
    defaultValues: { title: "", author: "", isbn: "" },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Create Book
      </Button>
    </form>
  );
}
```

### Store Pattern

Use Zustand for client-side state. Keep stores minimal:

```tsx
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

### Loading and Error States

Handle all async states explicitly:

```tsx
function BookList() {
  const { books, isLoading, error } = useBooks();

  if (isLoading) {
    return <BookListSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <p className="text-destructive">Failed to load books</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (books.length === 0) {
    return <EmptyState message="No books found" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
```

### Tailwind Styling

Use Tailwind utility classes. Extract repeated patterns to components:

```tsx
// Consistent spacing and responsive design
<div className="container mx-auto px-4 py-8">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* items */}
  </div>
</div>

// Use cn() for conditional classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

<button className={cn(
  "rounded-md px-4 py-2 font-medium",
  variant === "primary" && "bg-primary text-primary-foreground",
  variant === "outline" && "border border-input bg-background",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

## Quality Standards

### Every Component Must Have
- TypeScript interface for props
- Explicit return type or inferred from JSX
- Loading, error, and empty states where applicable
- Accessible markup (proper labels, ARIA when needed)

### Every Hook Must
- Return a typed object
- Handle loading and error states
- Clean up subscriptions/effects

### Every Form Must Have
- Zod schema for validation
- Error messages displayed inline
- Disabled state during submission
- Proper input labels and associations

### Every API Call Must
- Be typed with request and response types
- Handle errors gracefully
- Use consistent error messaging

## Figma-to-Code: Critical CSS Variable Translation Rules

**ROOT CAUSE**: The Figma MCP export generates CSS class patterns with slash-separated CSS variable names that DO NOT exist in this project's CSS. They silently fall back to wrong values, causing every font and weight to render incorrectly.

### Broken Patterns → Correct Replacements

| Figma Export (BROKEN) | Correct Tailwind | Why It's Broken |
|---|---|---|
| `font-[family-name:var(--font-family\/font-family-body,'DM_Sans:Semibold',sans-serif)]` | `font-[family-name:var(--font-dm-sans)]` | CSS var `--font-family/font-family-body` doesn't exist. Fallback `'DM_Sans:Semibold'` is not a valid CSS font-family name. |
| `font-[family-name:var(--font-family\/font-family-display,'DM_Sans:Semibold',sans-serif)]` | `font-[family-name:var(--font-dm-sans)]` | Same issue — display variant doesn't exist either. |
| `font-[family-name:var(--font-family\/font-family-body,'DM_Sans:Regular',sans-serif)]` | `font-[family-name:var(--font-dm-sans)]` | Same — the `:Regular` suffix is not CSS. |
| `font-[family-name:var(--font-family\/font-family-body,'DM_Sans:Medium',sans-serif)]` | `font-[family-name:var(--font-dm-sans)]` | Same. |
| `font-[var(--font-weight\/semibold,normal)]` | `font-semibold` | CSS var `--font-weight/semibold` doesn't exist. Fallback `normal` = weight 400. |
| `font-[var(--font-weight\/medium,normal)]` | `font-medium` | Same pattern, falls back to 400. |
| `font-[var(--font-weight\/bold,normal)]` | `font-bold` | Same pattern. |
| `font-['DM_Sans:Bold',sans-serif]` | `font-[family-name:var(--font-dm-sans)]` | Literal Figma font name, not valid CSS. |
| `font-['DM_Sans:Regular',sans-serif]` | `font-[family-name:var(--font-dm-sans)]` | Same. |
| `font-['Inter:Regular',sans-serif]` | `font-[family-name:var(--font-inter)]` | Same pattern for Inter font. |

### How This Project's Fonts Work
- **Next.js font loader** in `app/layout.tsx` loads DM Sans (weights 400/500/600/700) and Inter, creating CSS variables `--font-dm-sans` and `--font-inter`
- These variables are applied on `<html>` via className
- The ONLY valid font-family references are `var(--font-dm-sans)` and `var(--font-inter)`
- Weight 900 (font-black) is NOT loaded — never use it
- Font weight must be set via standard Tailwind classes: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

### Mandatory Post-Import Checklist
After importing ANY Figma-generated code:
1. Search for `font-family\/` — replace all with `font-[family-name:var(--font-dm-sans)]`
2. Search for `font-weight\/` — replace all with standard Tailwind weight classes
3. Search for `'DM_Sans:` or `'Inter:` — replace with CSS variable references
4. Verify NO slash-separated CSS variable names remain in the file
5. Check that all text elements have an explicit font-weight class

### Never Do
- Use `any` type—always define proper types
- Mutate state directly—use immutable updates
- Fetch data in components—use hooks and services
- Use inline styles—use Tailwind classes
- Skip loading/error states for async operations
- Use `useEffect` for data fetching—use React Query
