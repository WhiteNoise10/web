import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle,
} from "flowbite-react";
import {BsGithub, BsTelegram, BsWhatsapp,} from "react-icons/bs";

export function SocialMediasFooter() {
    return (
        <Footer container>
            <div className="w-full">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div>
                        <FooterBrand
                            href="https://library-of-ruina.fandom.com/wiki/Lobotomy_Corporation"
                            src="src/icons/LobotomyLogo.svg"
                            alt="Lobo logo"
                            name="LCorpNotes is a (not) unique fullstack website 😍!"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <FooterTitle title="frontend"/>
                            <FooterLinkGroup col>
                                <FooterLink href="https://www.typescriptlang.org/">TypeScript</FooterLink>
                                <FooterLink href="https://flowbite-react.com/">Flowbite-React</FooterLink>
                                <FooterLink href="https://tailwindcss.com/">Tailwind CSS</FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="backend"/>
                            <FooterLinkGroup col>
                                <FooterLink href="https://www.python.org/">Python</FooterLink>
                                <FooterLink href="https://flask.palletsprojects.com/en/stable/">Flask</FooterLink>
                                <FooterLink href="https://sqlite.org/">SQLite</FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="psychicend"/>
                            <FooterLinkGroup col>
                                <FooterLink href="https://www.catholicgallery.org/prayers/prayers-to-jesus/">Prayers to
                                    Jesus</FooterLink>
                                <FooterLink href="https://www.linearity.io/blog/anime-quotes/">Anime Motivational
                                    Quotes</FooterLink>
                                <FooterLink href="https://marvel.fandom.com/wiki/Peter_Parker_(Earth-616)">Peter
                                    Parker</FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider/>
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href="https://library-of-ruina.fandom.com/wiki/Lobotomy_Corporation"
                                     by="All Rights Are Not Reserved. Lobotomy Corporation is just a game reference™"
                                     year={2025}/>
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <FooterIcon href="https://t.me/N_e_g_r_u_s_t_i_n_Axaxa" icon={BsTelegram}/>
                        <FooterIcon href="https://wa.me/79180238653" icon={BsWhatsapp}/>
                        <FooterIcon href="https://github.com/WhiteNoise10" icon={BsGithub}/>
                    </div>
                </div>
            </div>
        </Footer>
    );
}
