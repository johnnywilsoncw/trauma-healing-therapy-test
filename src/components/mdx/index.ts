// Components available inside every MDX content file without importing them.
import Button from './Button.astro';
import ContactForm from './ContactForm.astro';
import CtaPair from './CtaPair.astro';
import Faq from './Faq.astro';
import MapEmbed from './MapEmbed.astro';
import MentayaWidget from './MentayaWidget.astro';
import YouTube from './YouTube.astro';
import Section from './Section.astro';
import CardGrid from './CardGrid.astro';
import InfoCard from './InfoCard.astro';

export const mdxComponents = { Section, CardGrid, InfoCard, Button, ContactForm, CtaPair, Faq, MapEmbed, MentayaWidget, YouTube };
