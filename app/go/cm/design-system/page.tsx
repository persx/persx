'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DesignSystemPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Design System</h1>
        <p className="text-muted-foreground text-lg">
          PersX.ai component library built with ShadCN UI
        </p>
      </div>

      <Separator />

      {/* Colors */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Colors</h2>
          <p className="text-muted-foreground">
            Semantic color palette with automatic dark mode support
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="w-full h-20 rounded-md bg-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-medium">Primary</p>
              <p className="text-sm text-muted-foreground">hsl(var(--primary))</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-full h-20 rounded-md bg-secondary" />
            </CardHeader>
            <CardContent>
              <p className="font-medium">Secondary</p>
              <p className="text-sm text-muted-foreground">hsl(var(--secondary))</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-full h-20 rounded-md bg-accent" />
            </CardHeader>
            <CardContent>
              <p className="font-medium">Accent</p>
              <p className="text-sm text-muted-foreground">hsl(var(--accent))</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-full h-20 rounded-md bg-destructive" />
            </CardHeader>
            <CardContent>
              <p className="font-medium">Destructive</p>
              <p className="text-sm text-muted-foreground">hsl(var(--destructive))</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Typography */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Typography</h2>
          <p className="text-muted-foreground">
            Consistent text styles across the application
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <code className="text-sm text-muted-foreground">text-4xl font-bold</code>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <code className="text-sm text-muted-foreground">text-3xl font-bold</code>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <code className="text-sm text-muted-foreground">text-2xl font-semibold</code>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Heading 4</h4>
              <code className="text-sm text-muted-foreground">text-xl font-semibold</code>
            </div>
            <div>
              <p className="text-base">Body text - The quick brown fox jumps over the lazy dog</p>
              <code className="text-sm text-muted-foreground">text-base</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Muted text - Additional information or descriptions
              </p>
              <code className="text-sm text-muted-foreground">text-sm text-muted-foreground</code>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Buttons */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Buttons</h2>
          <p className="text-muted-foreground">
            Various button styles and sizes for different use cases
          </p>
        </div>

        <Tabs defaultValue="variants" className="w-full">
          <TabsList>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
          </TabsList>

          <TabsContent value="variants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different visual styles for different contexts</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>Different sizes for different hierarchy levels</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button States</CardTitle>
                <CardDescription>Disabled and loading states</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Badges</h2>
          <p className="text-muted-foreground">
            Small status indicators and labels
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Cards</h2>
          <p className="text-muted-foreground">
            Versatile containers for content organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is the card content. You can put any content here including text,
                images, or other components.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Priority</span>
                <Badge variant="destructive">High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Forms */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Form Elements</h2>
          <p className="text-muted-foreground">
            Inputs, labels, and form components
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Example Form</CardTitle>
            <CardDescription>Form components in action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input id="message" placeholder="Enter your message" />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
      </section>

      <Separator />

      {/* Tabs */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tabs</h2>
          <p className="text-muted-foreground">
            Organize content into switchable panels
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tab Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="space-y-4">
                <p className="text-sm">Content for tab 1 goes here.</p>
              </TabsContent>
              <TabsContent value="tab2" className="space-y-4">
                <p className="text-sm">Content for tab 2 goes here.</p>
              </TabsContent>
              <TabsContent value="tab3" className="space-y-4">
                <p className="text-sm">Content for tab 3 goes here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Usage Guide */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Usage Guide</h2>
          <p className="text-muted-foreground">
            How to use these components in your code
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm">
                {`import { Button } from "@/components/ui/button"`}
                <br />
                {`import { Card, CardContent } from "@/components/ui/card"`}
                <br />
                {`import { Badge } from "@/components/ui/badge"`}
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              All components are built with Radix UI primitives and Tailwind CSS.
              They support dark mode automatically and are fully accessible.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
