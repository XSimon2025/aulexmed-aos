# AOS-ROE TikTok Review Operations Engine

## System Goal

AOS-ROE is the AULEXMED Review Operations Engine. TikTok is the first platform, but the architecture is platform-neutral so Temu and Amazon can be added later without rebuilding the analysis, case, action, notification, or reporting layers.

Stage 1 is supervised only:

- Collect reviews.
- Analyze with DeepSeek.
- Save review cases.
- Generate public reply drafts.
- Generate private message drafts for low-risk review follow-up.
- Send Feishu alerts for risky cases.
- Do not automatically send public replies.
- Do not automatically send private messages.
- Do not click refund, compensation, order modification, or other dangerous seller-center actions.

## Browser Control Method

The current TikTok Seller Center is opened in a cross-border browser for account and IP isolation. AOS-ROE should not force switching to ordinary Chrome.

Stage 1 supports a safe page-by-page workflow:

1. Read one TikTok product rating page.
2. Export or manually capture visible reviews into JSON.
3. Run AOS-ROE dry-run.
4. Review generated drafts.
5. Adjust rules or prompts.
6. Move to the next page.

If CDP becomes available for the cross-border browser, only `src/aos/roe/connectors/tiktok/` should change. The rest of the engine remains the same.

## Page Reading Method

Current safe input is a JSON file:

```bash
npm run aos:roe:collect -- --source=tmp/tiktok-reviews.json --dry-run
npm run aos:roe:dry-run -- --source=tmp/tiktok-reviews.json
npm run aos:roe:analyze -- --source=tmp/tiktok-reviews.json --dry-run
```

Input can be either an array or an object with `reviews`.

Current page observation on July 7, 2026:

- Browser: `ziniaobrowser`
- URL path: TikTok Seller Center product rating page
- Shop region: US
- Visible page size: 50 reviews per page
- Visible fields include rating, review text, reply count, existing reply preview, order ID, product ID, product name, SKU / size, username, reply entry, and review detail entry.
- Real order/customer data should not be committed to the repository.

```json
{
  "reviews": [
    {
      "platform": "tiktok",
      "shop_region": "US",
      "star_rating": 5,
      "review_content": "Great product and comfortable fit.",
      "review_language": "en",
      "review_date": "2026-07-07T00:00:00.000Z",
      "username": "example_user",
      "product_name": "AULEXMED Walking Boot",
      "product_id": "example-product-id",
      "order_id": "example-order-id",
      "sku": "example-sku",
      "size_model": "M",
      "has_public_reply": false,
      "public_reply_content": null,
      "can_open_review_detail": true,
      "can_open_order_detail": true
    }
  ]
}
```

## Data Structure

Supabase migration:

`supabase/migrations/20260707103000_create_review_operations_engine.sql`

Tables:

- `review_cases`
- `review_case_actions`
- `review_case_messages`
- `review_daily_summaries`

Deduplication:

- Primary logic: `platform + external_review_id` when available.
- Operational logic: `source_key`, built from platform, review ID, order ID, product ID, date, username, rating, and part of review content.
- Practical recommendation: when TikTok exposes order ID, keep order ID as the main operational duplicate guard.

## DeepSeek Analysis Logic

DeepSeek is required for normal analysis. If `DEEPSEEK_API_KEY` is missing or DeepSeek returns invalid JSON, AOS-ROE uses a conservative fallback and logs the reason.

AI returns:

- language
- sentiment
- product
- product model
- issue type
- issue reason
- negative review flag
- public reply need
- private message need
- after-sales case need
- Feishu alert need
- knowledge-base suggestion
- suggested solution
- public reply draft
- private message draft

Compliance boundaries:

- No cure / treat / heal / pain relief / doctor recommended / guaranteed recovery claims.
- No automatic refund promise.
- No automatic replacement promise.
- No direct request to change a review.

## Star Rating Strategy

5-star:

- Generate public reply draft only.
- Warm, happy, human, and varied.
- Use customer language.
- No private message.

4-star:

- Thank customer.
- Gently ask if there is anything to improve.
- Invite contact.
- Usually no private message unless a clear issue exists.

3-star:

- Public reply draft.
- Apologize that experience was not perfect.
- Give initial support direction if issue is clear.
- Create follow-up case.
- Human review required.

2-star / 1-star:

- Public reply draft.
- Private message draft.
- High-priority after-sales case.
- Feishu alert.
- No automatic refund or compensation promise.

Allowed compliant wording when appropriate:

> We’d like to make this right. If we’re able to resolve the issue for you, we’d really appreciate it if you could consider updating your feedback.

## Private Message Strategy

Private message drafts vary by issue type:

- size or fit
- damaged product
- missing parts
- logistics
- refund concern
- usage question
- wrong item
- quality concern

Stage 1 never sends the message. It only saves the draft and marks human review where needed.

## Feishu Alert Rules

Feishu alert is required for:

- 1-star
- 2-star
- 3-star with clear complaint
- broken / refund / missing / wrong size / not working / disappointed
- repeated issue patterns
- follow-up required

Message includes:

- star rating
- username
- product
- order ID
- issue type
- AI Chinese summary
- public reply draft
- private message draft
- suggested solution
- status
- whether human handling is required

## Daily Summary Logic

Daily summary includes:

- total reviews
- 5-star reply drafts
- 4-star reply drafts
- 1-3 star cases
- public reply drafts
- private message drafts
- pending follow-up count
- high-frequency issue ranking
- content team suggestions
- product / manual / knowledge-base suggestions

## Safety Boundary

Blocked in Stage 1:

- sending public replies
- sending private messages
- refunds
- compensation
- order changes
- asking customers to change reviews directly
- operating risky buttons in Seller Center

All actions are recorded in `review_case_actions`.

## Future Temu / Amazon Extension

Add platform connectors only:

- `src/aos/roe/connectors/temu/`
- `src/aos/roe/connectors/amazon/`

Keep shared layers:

- `services/`
- `analyzers/`
- `actions/`
- `db/`
- `prompts/`
- `types/`
- `reports/`

Platform-specific fields should be stored in `raw_payload` while normalized fields remain stable across platforms.
