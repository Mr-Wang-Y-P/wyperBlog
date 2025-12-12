// utils/frontmatter.js
const FRONT_MATTER_REGEX = /^---\s*\n([\s\S]*?)\n\s*---\s*\n/;

export const removeFrontmatter = (content) => {
  if (!content) return '';
  return content.replace(FRONT_MATTER_REGEX, '').trim();
};

export const parseFrontmatter = (content) => {
  const match = content.match(FRONT_MATTER_REGEX);
  if (!match) {
    return { metadata: {}, body: content.trim() };
  }

  const metadata = {};
  const lines = match[1].split('\n');

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/"/g, ''));
      }
      metadata[key.trim()] = value;
    }
  });

  return {
    metadata,
    body: content.replace(FRONT_MATTER_REGEX, '').trim(),
  };
};