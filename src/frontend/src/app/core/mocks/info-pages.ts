
export interface InfoSection {
  heading: string;
  body: string[];
}

export interface InfoPage {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  
  updated?: string;
}

export const INFO_PAGES: Record<string, InfoPage> = {
  help: {
    eyebrow: 'Support',
    title: 'Help Center',
    intro: 'Answers to the questions we hear most. If you can’t find what you need, our team is one message away.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'Every order gets a confirmation email within a few minutes of checkout, including your order number and an itemised receipt.',
          'You can follow an order end to end from My Orders in your account — from payment confirmed through to delivered.',
          'Orders can be changed or cancelled free of charge until they enter fulfilment, which is usually within one hour of being placed.',
        ],
      },
      {
        heading: 'Payments',
        body: [
          'We accept all major credit and debit cards. Your card is authorised at checkout and only charged when your order ships.',
          'Card details are handled by our payment processor and never stored on Budgetha’s servers.',
          'Promo codes apply to the item subtotal before shipping and tax. One code per order.',
        ],
      },
      {
        heading: 'Accounts',
        body: [
          'Creating an account saves your addresses and payment methods, and keeps your order history and wishlist in one place.',
          'Forgot your password? Use the reset link on the sign-in page and we’ll email you a secure link.',
          'You can update your details or close your account at any time from Account Settings.',
        ],
      },
    ],
  },

  'shipping-returns': {
    eyebrow: 'Support',
    title: 'Shipping & Returns',
    intro: 'What it costs, how long it takes, and how to send something back if it isn’t right.',
    sections: [
      {
        heading: 'Shipping options',
        body: [
          'Standard shipping is $6.99 and arrives in 3–5 business days.',
          'Orders over $75 ship free — the discount is applied automatically at checkout.',
          'Express shipping is available at checkout for delivery within 1–2 business days.',
          'Orders placed before 2pm on a business day are dispatched the same day.',
        ],
      },
      {
        heading: 'Tracking your delivery',
        body: [
          'You’ll get a tracking link by email as soon as your parcel leaves the warehouse.',
          'The same link is always available from My Orders in your account.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Return anything unused and in its original packaging within 30 days of delivery.',
          'Start a return from My Orders and we’ll email you a prepaid label.',
          'Refunds are issued to the original payment method within 5 business days of the parcel reaching us.',
          'For hygiene reasons, earphones and personal-care items can only be returned if the seal is unbroken.',
        ],
      },
    ],
  },

  warranty: {
    eyebrow: 'Support',
    title: 'Warranty',
    intro: 'Every item sold on Budgetha is covered against manufacturing defects.',
    sections: [
      {
        heading: 'What’s covered',
        body: [
          'All products carry a minimum 12-month warranty against defects in materials and workmanship.',
          'Selected electronics carry a 24-month manufacturer warranty — the term is listed on the product page.',
          'Warranty cover is in addition to, and does not replace, your statutory consumer rights.',
        ],
      },
      {
        heading: 'What’s not covered',
        body: [
          'Accidental damage, liquid damage, and normal cosmetic wear such as scratches and fading.',
          'Damage caused by unauthorised repair or modification.',
          'Consumable parts with a limited working life, such as batteries and filters, beyond their rated cycles.',
        ],
      },
      {
        heading: 'Making a claim',
        body: [
          'Open the order in My Orders and choose Report an issue, or contact us with your order number.',
          'Photos of the fault help us resolve claims faster.',
          'Approved claims are resolved by repair, replacement, or refund — whichever suits you best.',
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Support',
    title: 'Contact Us',
    intro: 'Real people, quick replies. Here’s the fastest way to reach the right team.',
    sections: [
      {
        heading: 'Customer support',
        body: [
          'Email support@budgetha.example and we’ll reply within one business day.',
          'Support hours are Monday to Friday, 9am–6pm, and Saturday, 10am–4pm.',
          'Include your order number and we’ll skip straight to the useful part.',
        ],
      },
      {
        heading: 'Orders and deliveries',
        body: [
          'For anything about a specific order, the quickest route is Report an issue on the order in My Orders — it reaches us with all the context attached.',
        ],
      },
      {
        heading: 'Selling on Budgetha',
        body: [
          'Interested in listing your products? Write to partners@budgetha.example with a short introduction and a link to your catalogue.',
        ],
      },
      {
        heading: 'Press and media',
        body: ['Media enquiries go to press@budgetha.example.'],
      },
    ],
  },

  'legal/privacy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'How Budgetha collects, uses, and protects your personal information.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'Account information you give us: your name, email address, delivery addresses, and order history.',
          'Payment information is collected and processed by our payment provider. We receive only a token and the last four digits of your card.',
          'Usage information such as pages viewed and searches run, which we use to improve the storefront.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and deliver your orders, and to provide support when something goes wrong.',
          'To keep your account secure and detect fraudulent activity.',
          'To improve our products and recommendations. You can opt out of marketing email at any time from Account Settings.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share the minimum necessary with delivery partners and payment processors to complete your order.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can request a copy of your data, correct it, or ask us to delete it by writing to privacy@budgetha.example.',
          'We keep order records for as long as tax and accounting rules require, even after an account is closed.',
        ],
      },
    ],
  },

  'legal/terms': {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated 1 July 2026',
    intro: 'The terms you agree to when you shop with or create an account on Budgetha.',
    sections: [
      {
        heading: 'Using Budgetha',
        body: [
          'You must be at least 18 years old, or have the consent of a parent or guardian, to place an order.',
          'You are responsible for keeping your account credentials confidential and for activity that happens under your account.',
          'Don’t misuse the service — no scraping, interference with the platform, or attempts to access other people’s accounts.',
        ],
      },
      {
        heading: 'Orders and pricing',
        body: [
          'An order is an offer to buy. The contract forms when we send your dispatch confirmation.',
          'We work hard to keep prices and stock accurate. Where an obvious error occurs, we may cancel the order and refund you in full.',
          'Prices include applicable tax unless stated otherwise at checkout.',
        ],
      },
      {
        heading: 'Cancellation and returns',
        body: [
          'Our returns terms are set out on the Shipping & Returns page and form part of these terms.',
          'Nothing here limits your statutory rights as a consumer.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'We provide the service with reasonable care and skill, but we don’t guarantee uninterrupted availability.',
          'We are not liable for indirect or consequential loss to the extent permitted by law.',
        ],
      },
    ],
  },

  'legal/cookies': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'Cookies and local storage keep your basket, session, and preferences working across visits.',
    sections: [
      {
        heading: 'Essential',
        body: [
          'These keep you signed in, remember what’s in your cart and wishlist, and protect checkout against fraud.',
          'The site cannot function without them, so they can’t be switched off.',
        ],
      },
      {
        heading: 'Preferences',
        body: [
          'Remember choices such as recently viewed products and whether you dismissed the install prompt.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'Aggregated, non-identifying data about which pages are used and where people run into trouble.',
          'We use it to prioritise what to fix and build next.',
        ],
      },
      {
        heading: 'Managing cookies',
        body: [
          'Every browser lets you review and delete cookies and site data in its settings.',
          'Blocking essential cookies will stop sign-in and checkout from working.',
        ],
      },
    ],
  },
};
