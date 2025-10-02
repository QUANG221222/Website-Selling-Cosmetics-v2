import Link from "next/link"

const FooterLink = ({text, linkText, href}: FooterLinkProps ) => {
  return (
    <div className="text-center">
        <span className="text-muted-foreground font-inter">
            {text}{` `}
            <Link href={href} className="text-brand-deep-pink hover:underline font-inter">
                {linkText}
            </Link>
        </span>
    </div>
  )
}

export default FooterLink