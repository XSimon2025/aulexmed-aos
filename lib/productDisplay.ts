import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";

const flagshipCopy: Record<string, { title: string; tagline: string; purpose: string; movement: string }> = {
  "BL-52036": {
    title: "Walking Boot",
    tagline: "Stable Support. Confident Steps.",
    purpose: "Built for ankle protection and steady daily movement after an injury or support need.",
    movement: "A protective shell, padded liner, adjustable straps, and air support structure help each step feel more controlled."
  },
  "BL-42001": {
    title: "ROM Knee Brace",
    tagline: "Controlled Motion. Confident Recovery.",
    purpose: "Designed for knee stability when movement needs structure, control, and a secure fit.",
    movement: "ROM-style side hinges and multi-strap adjustment support controlled knee positioning through daily movement."
  },
  "BL-42008": {
    title: "Knee Support Brace",
    tagline: "Daily Stability. Natural Movement.",
    purpose: "Created for everyday knee support with a stable feel and practical wearability.",
    movement: "Adjustable support and close-contact materials help the knee feel supported during normal activity."
  }
};

const categoryPurpose: Record<string, { tagline: string; purpose: string; movement: string }> = {
  "walking-boots": {
    tagline: "Stable Support. Confident Steps.",
    purpose: "Protective walking boot support for ankle recovery routines and controlled daily movement.",
    movement: "Structured shells, padded liners, and adjustable fastening help create a steady feel while moving."
  },
  "knee-braces": {
    tagline: "Stability and Control for Knee Movement.",
    purpose: "Knee support designed for stability, alignment, and confidence through everyday movement.",
    movement: "Hinges, stays, straps, and support panels work together to help the knee feel more secure."
  },
  "ankle-braces": {
    tagline: "Daily Ankle Support for Active Movement.",
    purpose: "Ankle support for everyday stability, comfortable fit, and practical daily wear.",
    movement: "Wraps, straps, and breathable materials help provide a close and adjustable support feel."
  },
  "back-posture-support": {
    tagline: "Everyday Alignment and Comfort.",
    purpose: "Back, thoracic, and posture support for daily routines that need structure and comfort.",
    movement: "Broad support panels and adjustable closures help encourage a stable, comfortable fit."
  },
  "wrist-finger-support": {
    tagline: "Targeted Support for Hand and Upper-Limb Needs.",
    purpose: "Wrist and finger support for focused stabilization and everyday hand movement needs.",
    movement: "Soft contact materials and targeted structures help support the wrist, hand, or finger area."
  }
};

function modelFromSku(sku: string) {
  return sku.replace(/^BL-/i, "");
}

function titleFromName(name: string) {
  return name.replace(/^\d+\s*/, "").replace(/\bBL-\d+\b/gi, "").trim();
}

export function getProductDisplay(product: Product) {
  const category = getCategory(product.categorySlug);
  const categoryCopy = categoryPurpose[product.categorySlug] ?? {
    tagline: "Daily Orthopedic Support.",
    purpose: "AULEXMED support designed for practical fit, daily movement, and product support routing.",
    movement: "Adjustable materials and structured support details help provide a stable everyday feel."
  };
  const flagship = flagshipCopy[product.sku];

  return {
    title: flagship?.title ?? titleFromName(product.name),
    tagline: flagship?.tagline ?? categoryCopy.tagline,
    model: `Model ${modelFromSku(product.sku)}`,
    categoryName: category?.name ?? "Orthopedic Support",
    purpose: flagship?.purpose ?? categoryCopy.purpose,
    movement: flagship?.movement ?? categoryCopy.movement
  };
}
