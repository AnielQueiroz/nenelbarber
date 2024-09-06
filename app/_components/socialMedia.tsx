"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "./ui/button"

interface SocialMediaProps {
  url: string
}

const SocialMedia = ({ url }: SocialMediaProps) => {
  // Identifica a rede social com base na URL
  let socialMediaIcon = null
  let socialMediaName = ""

  if (url.includes("facebook")) {
    socialMediaIcon = <Facebook />
    socialMediaName = "Facebook"
  } else if (url.includes("instagram")) {
    socialMediaIcon = <Instagram />
    socialMediaName = "Instagram"
  } else if (url.includes("twitter")) {
    socialMediaIcon = <Twitter />
    socialMediaName = "Twitter"
  }

  // Definir o ícone da direita com um tamanho personalizado
  const socialMediaIconRight = (
    <>
      {url.includes("facebook") && <Facebook size={16} />}
      {url.includes("instagram") && <Instagram size={16} />}
      {url.includes("twitter") && <Twitter size={16} />}
    </>
  )

  // Funcao que rediciona para a URL da rede social
  const handleClick = () => {
    window.open(url, "_blank")
  }

  return (
    <div className="flex justify-between" key={url}>
      {/* ESQUERDA */}
      <div className="flex items-center gap-2">
        {socialMediaIcon}
        <p className="text-sm">{socialMediaName}</p>
      </div>

      {/* DIREITA */}
      <Button variant="outline" size="sm" onClick={handleClick}>
        {socialMediaIconRight}
      </Button>
    </div>
  )
}

export default SocialMedia
