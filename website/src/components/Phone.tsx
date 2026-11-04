import './Phone.css';

/**
 * An iPhone frame around a screenshot of the app.
 * Put screenshots in public/screens/ (copy them from docs/design/screens) and pass the file name.
 * For Apple's official frames see https://developer.apple.com/design/resources/ (Product Bezels).
 */
export function Phone({ screen, width = 320, alt }: { screen: string; width?: number; alt: string }) {
  return (
    <div className="phone" style={{ width }}>
      <div className="phone-screen">
        <img src={`${import.meta.env.BASE_URL}screens/${screen}`} alt={alt} />
        <span className="phone-island" aria-hidden="true" />
      </div>
    </div>
  );
}
