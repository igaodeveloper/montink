"use client";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ShippingCalculator from "@/components/product/ShippingCalculator";
import {
  Truck,
  Shield,
  RotateCcw,
  Clock,
  ChevronRight,
  Star,
  HelpCircle,
  BadgeCheck,
  ShoppingCart,
  Share2,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useCart } from "@/components/cart-context";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

// Sample product data
const product = {
  title: "Camiseta Personalizada",
  price: 69.9,
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  ],
  colorVariants: {
    Preto: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691229-a3d2c61b2502?w=800&q=80",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80",
    ],
    Branco: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    Azul: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018543-1d16f3c8f086?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
    ],
    Vermelho: [
      "https://images.unsplash.com/photo-1542827474-255e98ec2b42?w=800&q=80",
      "https://images.unsplash.com/photo-1542827474-48884df92058?w=800&q=80",
      "https://images.unsplash.com/photo-1551489446-2f67fb4a0275?w=800&q=80",
      "https://images.unsplash.com/photo-1552860118-92d1cdb52921?w=800&q=80",
    ],
    Verde: [
      "https://images.unsplash.com/photo-1606299620033-a6926b893459?w=800&q=80",
      "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=800&q=80",
      "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
    ],
  },
  variants: {
    size: ["P", "M", "G", "GG", "XGG"],
    color: ["Preto", "Branco", "Azul", "Vermelho", "Verde"],
  },
  rating: 4.9,
  reviewCount: 256,
};

export default function Page() {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Handle quick add to cart from CTA section
  const handleQuickAddToCart = () => {
    // Add with default size and color
    addItem({
      id: Math.random().toString(36).substring(2, 9), // Generate a simple random ID
      title: product.title,
      price: product.price,
      quantity: 1,
      size: product.variants.size[3], // Default to size 40
      color: product.variants.color[0], // Default to first color
      image: product.images[0], // Use first image
    });

    setAddedToCart(true);

    // Reset state after a short delay
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);

    // Vibrate if available (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Show toast notification
    toast({
      title: "Produto adicionado!",
      description: "Camiseta adicionada ao carrinho com sucesso.",
      variant: "default", // Changed from "success" to "default"
    });
  };

  // Handle share functionality
  const handleShare = (platform: string) => {
    // Informações a serem compartilhadas
    const shareData = {
      title: product.title,
      text: `Confira essa incrível ${product.title} na Montink Store!`,
      url: window.location.href,
    };

    // Compartilhar em diferentes plataformas ou usando a API de compartilhamento do navegador
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
          "_blank",
        );
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
          variant: "default", // Changed from "success" to "default"
        });
        break;
      default:
        // Usar a API de Compartilhamento se disponível
        if (navigator.share) {
          navigator
            .share(shareData)
            .catch((error) => console.log("Error sharing", error));
        } else {
          navigator.clipboard.writeText(shareData.url);
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
            variant: "default",
          });
        }
    }

    // Fechar o diálogo após compartilhar
    setIsShareDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 h-60 w-60 rounded-full bg-purple-500/5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
      />

      {/* Header */}
      <Header />

      {/* Navigation breadcrumb */}
      <div className="container py-4">
        <motion.nav
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <a
                href="#"
                className="hover:text-primary hover:underline transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary hover:underline transition-colors"
              >
                Produtos
              </a>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary hover:underline transition-colors"
              >
                Camisetas
              </a>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li className="truncate font-medium text-foreground flex items-center">
              <span>{product.title}</span>
              <motion.span
                className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                <BadgeCheck className="mr-1 h-3 w-3" />
                Premium
              </motion.span>
            </li>
          </ol>
        </motion.nav>
      </div>

      {/* Main product section */}
      <motion.div
        className="container pb-16 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.2 }}
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Product Gallery - Left side on desktop */}
          <motion.div
            className="md:col-span-1 rounded-xl product-gallery"
            variants={fadeInUp}
          >
            <ProductGallery
              images={product.images}
              colorVariants={product.colorVariants}
            />

            {/* Product quick stats */}
            <motion.div
              className="mt-4 grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 rounded-lg border p-3 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3"
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating} ({product.reviewCount} avaliações)
                </span>
              </div>
              <a
                href="#reviews"
                className="flex items-center justify-center gap-1 rounded-lg border p-3 text-xs text-primary hover:bg-primary/5 transition-colors"
              >
                <HelpCircle className="h-3 w-3" />
                Ver todas avaliações
              </a>
            </motion.div>
          </motion.div>

          {/* Product Info - Middle on desktop */}
          <motion.div className="md:col-span-1" variants={fadeInUp}>
            <ProductInfo
              title={product.title}
              price={product.price}
              variants={product.variants}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </motion.div>

          {/* Shipping Calculator - Right side on desktop */}
          <motion.div
            className="md:col-span-2 lg:col-span-1"
            variants={fadeInUp}
          >
            <ShippingCalculator />
          </motion.div>
        </div>

        {/* Benefits section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-4 text-xl font-bold">Por que comprar conosco?</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              className="flex flex-col items-center rounded-lg border bg-card/80 p-4 text-center shadow-sm transition-all backdrop-blur-sm hover:border-primary/50 hover:shadow-md"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Frete Grátis</h3>
              <p className="text-xs text-muted-foreground">
                Para todo o Brasil
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center rounded-lg border bg-card/80 p-4 text-center shadow-sm transition-all backdrop-blur-sm hover:border-primary/50 hover:shadow-md"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Garantia de 1 Ano</h3>
              <p className="text-xs text-muted-foreground">Contra defeitos</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center rounded-lg border bg-card/80 p-4 text-center shadow-sm transition-all backdrop-blur-sm hover:border-primary/50 hover:shadow-md"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Troca Fácil</h3>
              <p className="text-xs text-muted-foreground">
                30 dias para trocar
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center rounded-lg border bg-card/80 p-4 text-center shadow-sm transition-all backdrop-blur-sm hover:border-primary/50 hover:shadow-md"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Entrega Rápida</h3>
              <p className="text-xs text-muted-foreground">Opções expressas</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Product description */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="mb-4 text-2xl font-bold">Descrição do Produto</h2>
          <div className="rounded-xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                A Camiseta Personalizada da Montink é perfeita para você
                expressar sua individualidade ou promover sua marca. Fabricada
                com materiais de alta qualidade, oferece conforto excepcional e
                durabilidade para uso diário.
              </p>
              <p className="mt-4">
                Nossas camisetas são produzidas sob demanda com tecnologia de
                impressão digital de última geração, garantindo cores vibrantes
                e detalhes nítidos que não desbotam com o tempo.
              </p>
              <h3 className="mt-6 mb-2 text-xl font-semibold">
                Características
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Material: 100% algodão penteado fio 30.1</li>
                <li>Gramatura: 165g/m²</li>
                <li>Acabamento: Gola reforçada</li>
                <li>Tecnologia de impressão: DTG (Direct-to-Garment)</li>
                <li>Impressão: Frente e/ou costas (conforme design)</li>
              </ul>

              <h3 className="mt-6 mb-2 text-xl font-semibold">Tecnologias</h3>
              <p>
                Utilizamos a tecnologia DTG (Direct-to-Garment) que permite a
                impressão diretamente no tecido, garantindo maior qualidade,
                durabilidade e conforto. Nossas tintas são à base d'água,
                ecologicamente corretas e certificadas para contato com a pele.
              </p>

              <h3 className="mt-6 mb-2 text-xl font-semibold">Cuidados</h3>
              <p>
                Para preservar a qualidade da estampa, recomendamos lavar ao
                avesso, com água fria e sabão neutro. Não usar alvejante ou
                secadora. Passar ao avesso e evitar o contato do ferro com a
                estampa.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 rounded-xl border bg-gradient-to-br from-primary/10 to-blue-500/5 p-8 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold">Gostou do produto?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Adicione ao carrinho agora mesmo e aproveite o frete grátis para
            compras acima de R$ 299,90.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 relative overflow-hidden"
              onClick={handleQuickAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>Produto Adicionado!</span>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </motion.div>
              )}
              {!addedToCart && (
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                ></motion.span>
              )}
            </Button>

            {/* Share Dialog */}
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 hover:bg-primary/10 group"
                >
                  <Share2 className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-primary transition-colors">
                    Compartilhar
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Compartilhar Produto</DialogTitle>
                  <DialogDescription>
                    Compartilhe este produto nas suas redes sociais.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                  <motion.button
                    onClick={() => handleShare("facebook")}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="rounded-full bg-blue-500 p-3 text-white">
                      <Facebook className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Facebook</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare("twitter")}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="rounded-full bg-sky-500 p-3 text-white">
                      <Twitter className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Twitter</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare("whatsapp")}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="rounded-full bg-green-500 p-3 text-white">
                      <Icons.whatsapp className="h-5 w-5" />
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare("copy")}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="rounded-full bg-gray-500 p-3 text-white">
                      <Icons.copy className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Copiar Link</span>
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
