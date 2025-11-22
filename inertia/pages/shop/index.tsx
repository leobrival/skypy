import { Head } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import AppLayout from '../../layouts/app_layout'

interface User {
  id: string
  username: string
  accountTier: 'free' | 'premium'
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
}

export default function ShopIndex({
  products,
  user,
}: {
  products: Product[]
  user: User
}) {
  return (
    <AppLayout>
      <Head title="Marketplace" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and purchase virtual card products
          </p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                No products available yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Check back soon for virtual card products and digital goods
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <Button>Purchase</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {user.accountTier === 'free' && (
          <Card className="mt-8 border-primary">
            <CardHeader>
              <CardTitle>Want to sell your own products?</CardTitle>
              <CardDescription>
                Upgrade to Premium to list and sell your virtual cards and
                digital products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default">Upgrade to Premium</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
