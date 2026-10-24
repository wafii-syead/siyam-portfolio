// Edit identity, links, sections, and project content here. No admin dashboard is required.
export const identity = {
  name: 'Shariyar Siyam',
  roles: ['Graphic Designer', 'UI/UX Designer', 'Canva Expert'],
  employer: { name: 'Raytas.co', url: 'https://raytas.co/' },
  bio: 'I’m Shariyar Siyam, a Graphic Designer at Raytas.co, UI/UX Designer, and Canva Expert. I create brand visuals, intuitive interfaces, and editable content for businesses and creators.',
};
export const socialLinks = [
  { name: 'Behance', short: 'Bē', url: 'https://www.behance.net/shariyarsiyam' },
  { name: 'Dribbble', short: 'Dr', url: 'https://dribbble.com/ShariyarSiyam' },
  { name: 'Instagram', short: 'Ig', url: 'https://www.instagram.com/ars_siyam/' },
  { name: 'Facebook', short: 'Fb', url: 'https://www.facebook.com/shahriarmohammod.siame.9' },
];
// The page owner is not confirmed, so this is not displayed by default.
export const additionalFacebookPage = { enabled: false, label: 'Facebook page', url: 'https://www.facebook.com/profile.php?id=100093678643110' };
export const navigation = ['Work', 'Services', 'About', 'Process', 'Contact'];
export const services = [
  { id: 'brand', title: 'Brand Identity', description: 'A distinctive visual language, from the first impression to the smallest detail.', icon: 'spark', tags: 'Identity · Visual direction' },
  { id: 'social', title: 'Social Media Design', description: 'Thoughtful visuals that bring your message to life across your social channels.', icon: 'grid', tags: 'Posts · Campaign visuals' },
  { id: 'uiux', title: 'Website & App UI/UX', description: 'Clear, considered digital interfaces that connect people with what they need.', icon: 'cursor', tags: 'Interfaces · Digital experiences' },
  { id: 'canva', title: 'Canva Templates', description: 'Reusable, editable layouts that help you keep your content feeling like your brand.', icon: 'layers', tags: 'Editable layouts · Consistency' },
  { id: 'print', title: 'Posters & Marketing Materials', description: 'Expressive compositions made to get your message noticed, on screen or in print.', icon: 'poster', tags: 'Posters · Flyers · Banners' },
  { id: 'youtube', title: 'YouTube Thumbnails', description: 'Bold, focused thumbnail designs that tell the story before the first click.', icon: 'play', tags: 'Thumbnails · Visual storytelling' },
] as const;
export type ServiceId = typeof services[number]['id'];
export type Category = 'Branding' | 'UI/UX' | 'Social Media' | 'Print';
export type Project = { id: string; title: string; category: Category; image: string; alt: string; url: string; className?: string };
export const projects: Project[] = [
  { id: 'bella', title: 'Bella — Bold Branding for the Modern Food Lover', category: 'Branding', image: '/images/bella.webp', alt: 'Bella brand identity project cover from Shariyar Siyam’s Behance portfolio', url: 'https://www.behance.net/gallery/252748115/Bella-Bold-Branding-for-the-Modern-Food-Lover', className: 'wide' },
  { id: 'dashboard', title: 'Modern Dark Mode Admin Dashboard & Analytics UI', category: 'UI/UX', image: '/images/dashboard.webp', alt: 'Dark dashboard and analytics interface project cover', url: 'https://www.behance.net/gallery/253526523/Modern-Dark-Mode-Admin-Dashboard-Analytics-UI' },
  { id: 'travora', title: 'Travora Travel and tour branding', category: 'Branding', image: '/images/travora.webp', alt: 'Travora travel and tour brand identity project cover', url: 'https://www.behance.net/gallery/252022741/Travora-Travel-and-tour-branding' },
  { id: 'fashion', title: 'Trendy summer fashion website landing page design', category: 'UI/UX', image: '/images/fashion.webp', alt: 'Summer fashion website landing page project cover', url: 'https://www.behance.net/gallery/191576167/Trendy-summer-fashion-website-landing-page-design', className: 'wide' },
  { id: 'thumbnails', title: 'You Tube Thumbnails Design', category: 'Social Media', image: '/images/thumbnails.webp', alt: 'Collection of YouTube thumbnail designs', url: 'https://www.behance.net/gallery/202156843/You-Tube-Thumbnails-Design', className: 'half' },
  { id: 'posters', title: 'typographic vintage poster design', category: 'Print', image: '/images/posters.webp', alt: 'Experimental typographic vintage poster collection cover', url: 'https://www.behance.net/gallery/254168601/typographic-vintage-poster-design', className: 'half' },
];
export const featuredStory = {
  title: 'TYPE WITH ATTITUDE.',
  subtitle: 'Typographic vintage poster design',
  label: 'Experimental poster collection',
  url: projects[5].url,
  overview: 'A collection of experimental event and culture posters, exploring the meeting point of retro print and contemporary street art.',
  objective: 'Explore different moods through bold typography, high contrast, and distressed texture.',
  direction: 'Retro halftones, acid-green nightlife graphics, and grunge-inspired compositions.',
  deliverables: 'Poster layouts and in-situ mockups, presented in the original project.',
  tools: ['Photoshop', 'Canva'],
};
export const playground = [
  { title: 'Red, yellow and beige modern social media post', image: '/images/social.webp', url: 'https://www.behance.net/gallery/256301843/Red-yellow-and-beige-modern-social-media-post' },
  { title: 'Personalised Children’s Book Social Media Campaign', image: '/images/books.webp', url: 'https://www.behance.net/gallery/255738357/Personalised-Childrens-Book-Social-Media-Campaign' },
];
export const processSteps = [
  { title: 'Discover', text: 'We start with your story, your audience, and what you want the design to do.' },
  { title: 'Define', text: 'Together, we shape a clear brief, a visual direction, and the scope of the work.' },
  { title: 'Design', text: 'I explore ideas and turn the chosen direction into considered visual designs.' },
  { title: 'Refine', text: 'We review the work and use your feedback to strengthen the details.' },
  { title: 'Deliver', text: 'You receive the agreed design files, ready for their intended use.' },
];
export const faqs = [
  { question: 'What can we create together?', answer: 'Brand identities, social media visuals, website and app interfaces, Canva templates, posters, marketing materials, and YouTube thumbnails. Tell me what you have in mind and we can work out the right scope.' },
  { question: 'How do I start a project?', answer: 'Send a message with a little about your business and what you would like to create. Use the project form when available, or reach me through Facebook or Instagram.' },
  { question: 'What should I include in my brief?', answer: 'Your goal, audience, required designs, preferred timing, and any brand assets or references are a useful start. Include your budget if you already have one in mind.' },
  { question: 'What does collaboration look like?', answer: 'The proposed process is Discover, Define, Design, Refine, and Deliver. We agree on scope, feedback stages, and timing before the work begins.' },
  { question: 'Can I get editable design files?', answer: 'Editable Canva templates are one of my services. Let me know which files you need to edit so we can agree on formats and handover as part of your project.' },
  { question: 'Where can I contact you?', answer: 'You can reach me through the personal Facebook and Instagram links below. When the project form is available, you can also send a brief directly from this website.' },
];
// Keep these hidden until real, approved material is supplied.
export const optionalSections = {
  testimonials: [] as { quote: string; name: string; role: string }[],
  insights: [] as { title: string; url: string; summary: string }[],
};
