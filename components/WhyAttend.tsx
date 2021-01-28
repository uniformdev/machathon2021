import { Entry } from 'contentful';
import { WhyAttendFields } from '../lib/contentful';

export const WhyAttend = ({ fields: { title, description, image } }: Entry<WhyAttendFields>) => (
  <section className="bg-white border-b py-8">
    <div className="container mx-auto flex flex-wrap pt-4 pb-12">
      <div className="w-1/2">
        {image && 
        <img 
          src={image.fields?.file?.url} 
          className="p-10"          
          alt={image.fields.title} 
          width={image.fields.file.details.image.width ?? 400} 
          height={image.fields.file.details.image.height ?? 400}
          loading="lazy" 
        />
        }
      </div>
      <div className="w-1/2">
        <div className="p-10">
          <h2 className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800">{title}</h2>
          <hr />
          <p className="text-gray-800 p-10 whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>
  </section>
);
