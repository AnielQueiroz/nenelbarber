"use client"

import { Copy, MessageCircle, SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import Link from "next/link"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast.success("Telefone copiado!")
  }

  const formatWhatsappLink = (phone: string) => {
    // Remove espacos, parenteses e outros caracteres especiais
    const cleanPhone = phone.replace(/\D/g, "")
    const encodedMessage = encodeURIComponent(
      "Ola, gostaria de marcar um horário!",
    )
    return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`
  }

  return (
    <div className="flex justify-between" key={phone}>
      {/* ESQUERDA */}
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>

      {/* DIREITA */}
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopyPhoneClick(phone)}
        >
          <Copy size={16} />
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link href={formatWhatsappLink(phone)}>
            <MessageCircle size={16} />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default PhoneItem
