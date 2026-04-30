export const maintenanceSeedData = {
  slug: "maintenance",
  heroTitle: "Maintenance & Pilot Excellence.",
  heroSubtitle: "Uncompromising Safety",
  heroDesc: "Maintained to the highest standards of airworthiness and operated by elite DGCA-approved examiners and senior captains.",
  heroImage: "/images/maintenance.jpg",
  sections: [
    {
      type: "TABS",
      order: 0,
      title: "Maintenance Overview",
      items: [
        {
          order: 0,
          subtitle: "Maintenance History",
          title: "Maintenance History",
          description: "The aircraft has undergone a comprehensive C-Check in accordance with the approved maintenance program and is maintained to the highest standards of airworthiness.\n\nAll scheduled and unscheduled maintenance is carried out by DGCA-approved maintenance organizations, with full compliance to regulatory requirements. Technical records, including aircraft logbooks, are accurately maintained and up to date, ensuring complete traceability of all maintenance activities.\n\nThe aircraft continues to operate under a strict maintenance and inspection regime, reflecting our commitment to safety, reliability, and regulatory compliance.",
          image: "/images/Engineering.jpg",
          extraData: JSON.stringify({
            mainHeading: "A Strict Regime of Airworthiness",
            badge: {
              icon: "ShieldCheck",
              title: "DGCA Compliant",
              desc: "Ensuring complete traceability of all maintenance activities and fully updated technical logs."
            },
            features: [
              {
                icon: "Wrench",
                title: "C-Check Complete",
                desc: "Comprehensive program approved"
              },
              {
                icon: "ClipboardCheck",
                title: "Total Traceability",
                desc: "100% up-to-date aircraft logs"
              }
            ]
          })
        },
        {
          order: 1,
          subtitle: "Pilot Experience",
          title: "Pilot Experience",
          description: "Our pilot panel comprises DGCA-approved examiners and senior captains with extensive operational and instructional experience.\n\nThe team includes captains with individual flying experience ranging from 3,100 to 13,000 hours, bringing deep expertise across line operations, training, and regulatory evaluation.\n\nWith multiple DGCA examiners within the panel, all assessments and training inputs are aligned with current regulatory standards and industry expectations.",
          image: "/images/pexp.jpg",
          extraData: JSON.stringify({
            mainHeading: "Elite Captains & DGCA Examiners",
            badge: {
              icon: "Award",
              title: "Senior Instructors",
              desc: "Aligned with global standard regulatory expectations."
            },
            features: [
              {
                icon: "Star",
                title: "Up to 13,000 Hours",
                desc: "Individual Captain Flying Experience"
              },
              {
                icon: "Users",
                title: "DGCA Examiners",
                desc: "Direct regulatory alignment in training"
              }
            ]
          })
        }
      ]
    }
  ]
};