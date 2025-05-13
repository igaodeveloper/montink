"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Heart,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "./icons";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const footerLinks = [
    {
      title: "Institucional",
      links: [
        { name: "Sobre Nós", href: "#sobre-nos", icon: <Icons.info className="h-4 w-4" /> },
        { name: "Planos", href: "#planos", icon: <Icons.star className="h-4 w-4" /> },
        { name: "Trabalhe Conosco", href: "#carreiras", icon: <Icons.user className="h-4 w-4" /> },
        { name: "Política de Privacidade", href: "#privacidade", icon: <ShieldCheck className="h-4 w-4" /> },
        { name: "Termos de Uso", href: "#termos", icon: <Icons.file className="h-4 w-4" /> },
      ],
    },
    {
      title: "Ajuda e Conhecimento",
      links: [
        { name: "Central de Ajuda", href: "#ajuda", icon: <Icons.help className="h-4 w-4" /> },
        { name: "Fale Conosco", href: "#contato", icon: <Mail className="h-4 w-4" /> },
        { name: "Canal no YouTube", href: "https://youtube.com", icon: <Youtube className="h-4 w-4" /> },
        { name: "Blog Montink", href: "#blog", icon: <Icons.pencil className="h-4 w-4" /> },
        { name: "Perguntas Frequentes", href: "#faq", icon: <Icons.question className="h-4 w-4" /> },
      ],
    },
    {
      title: "Produtos",
      links: [
        { name: "Camisetas", href: "#camisetas", icon: <Icons.tshirt className="h-4 w-4" /> },
        { name: "Moletons", href: "#moletons", icon: <Icons.hoodie className="h-4 w-4" /> },
        { name: "Canecas", href: "#canecas", icon: <Icons.cup className="h-4 w-4" /> },
        { name: "Acessórios", href: "#acessorios", icon: <Icons.tag className="h-4 w-4" /> },
        { name: "Catálogo Completo", href: "#catalogo", icon: <Icons.book className="h-4 w-4" /> },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={18} />, href: "https://facebook.com" },
    { name: "Twitter", icon: <Twitter size={18} />, href: "https://twitter.com" },
    { name: "Instagram", icon: <Instagram size={18} />, href: "https://instagram.com" },
    { name: "Youtube", icon: <Youtube size={18} />, href: "https://youtube.com" },
  ];

  const paymentMethods = [
    "Visa", "Mastercard", "American Express", "PayPal", "Pix", "Boleto"
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, digite seu email para se inscrever.",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, digite um email válido.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulando um envio de formulário
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      
      toast({
        title: "Inscrição confirmada!",
        description: "Obrigado por se inscrever na nossa newsletter.",
        variant: "success",
      });
    }, 1500);
  };

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 pt-12">
      <div className="container">
        {/* Newsletter */}
        <motion.div 
          className="mb-10 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/10 p-6 backdrop-blur-sm md:p-8"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-md text-center md:text-left">
              <motion.h3 
                className="text-xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Entre para o mundo do Print on Demand!
              </motion.h3>
              <motion.p 
                className="mt-2 text-sm text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Cadastre-se para receber dicas, tutoriais e novidades sobre como alavancar seu negócio.
              </motion.p>
            </div>
            <motion.div 
              className="w-full max-w-md"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form onSubmit={handleSubscribe}>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    className="bg-background/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <motion.div 
                        className="flex items-center gap-1.5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className="h-4 w-4" />
                        <span>Inscrever</span>
                      </motion.div>
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ao se inscrever, você concorda com nossa{" "}
                  <Link href="#privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer content */}
        <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icons.logo className="h-8 w-8 mr-2 transition-transform group-hover:scale-110" />
              </motion.div>
              <motion.span 
                className="text-xl font-bold text-primary"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Montink
              </motion.span>
              <motion.span 
                className="ml-1 text-xs font-normal text-muted-foreground"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                STORE
              </motion.span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Somos uma plataforma de Print On Demand, onde pessoas ou empresas conseguem ter seus produtos personalizados 
              com suas estampas, vender e lucrar muito, sem precisar investir em estoque, produção ou logística.
            </p>

            <div className="mt-6 space-y-2">
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <MapPin size={16} className="text-primary" />
                <span>Belo Horizonte, MG</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <Phone size={16} className="text-primary" />
                <a href="tel:+551199999999" className="hover:text-primary transition-colors">
                  Central de Atendimento
                </a>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <Mail size={16} className="text-primary" />
                <a href="mailto:contato@montink.com.br" className="hover:text-primary transition-colors">
                  contato@montink.com.br
                </a>
              </motion.div>
            </div>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links section */}
          {footerLinks.map((column, idx) => (
            <motion.div 
              key={column.title} 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h4 className="text-sm font-semibold">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <motion.li 
                    key={link.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary group transition-colors"
                    >
                      <motion.span 
                        className="text-muted-foreground/50 group-hover:text-primary transition-colors"
                        whileHover={{ rotate: 20 }}
                      >
                        {link.icon}
                      </motion.span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Payment methods and trust badges */}
        <motion.div 
          className="border-t border-border py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-3 text-xs font-semibold">Formas de Pagamento</h4>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method, idx) => (
                  <motion.div 
                    key={method}
                    className="flex h-8 items-center justify-center rounded-md border border-border bg-background/50 px-2 text-xs text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -2, borderColor: "rgba(0, 120, 255, 0.5)" }}
                  >
                    {method}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-xs font-semibold">Segurança</h4>
              <div className="flex gap-4">
                <motion.div 
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  whileHover={{ y: -2 }}
                >
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Site 100% Seguro</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  whileHover={{ y: -2 }}
                >
                  <CreditCard size={16} className="text-primary" />
                  <span>Pagamento Seguro</span>
                </motion.div>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-xs font-semibold">Entrega</h4>
              <motion.div 
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                whileHover={{ y: -2 }}
              >
                <Truck size={16} className="text-primary" />
                <span>Enviamos para todo o Brasil</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="border-t border-border py-6 text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>© {year} Montink LTDA. CNPJ: 22.733.912/0001-05. Todos os direitos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Feito com muito <motion.span whileHover={{ scale: 1.3 }}><Heart size={10} className="text-red-500" /></motion.span> & ☕, de BH para o Mundo. Desde 2014.
          </p>
        </motion.div>
      </div>
    </footer>
  );
} 