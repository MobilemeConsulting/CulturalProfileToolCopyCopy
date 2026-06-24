import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Calendar, Tag, TrendingUp } from 'lucide-react';

interface MetadataFormProps {
  meta: {
    orgName: string;
    orgType: string;
    year: number;
  };
  updateMeta: (field: string, value: string | number) => void;
  organisationType: 'cultural' | 'profit';
}

export function MetadataForm({ meta, updateMeta, organisationType }: MetadataFormProps) {
  const isCultural = organisationType === 'cultural';
  const icon = isCultural ? Building2 : TrendingUp;
  const IconComponent = icon;
  const gradientClass = isCultural 
    ? 'from-purple-50 to-pink-50' 
    : 'from-blue-50 to-indigo-50';
  const iconColor = isCultural ? 'text-purple-600' : 'text-blue-600';
  const title = isCultural ? 'Culturele Organisatie' : 'Profit Bedrijf';
  const description = isCultural 
    ? 'Vul de basisinformatie van uw culturele organisatie in'
    : 'Vul de basisinformatie van uw bedrijf in';

  const backgroundImage = isCultural
    ? 'https://images.unsplash.com/photo-1701318226666-6b5b02d3df4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmUlMjBtdXNldW18ZW58MXx8fHwxNzcxNjQ3NDcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    : 'https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwdGVjaG5vbG9neSUyMGZ1dHVyZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcxNjg1MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080';

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      ></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}/95`}></div>
      
      <Card className="relative bg-transparent border-0">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCultural ? 'bg-purple-100' : 'bg-blue-100'}`}>
              <IconComponent className={`w-6 h-6 ${iconColor}`} />
            </div>
            {title}
          </CardTitle>
          <CardDescription className="text-slate-700 font-medium ml-13">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="flex items-center gap-2">
              <IconComponent className="w-4 h-4 text-slate-500" />
              {isCultural ? 'Organisatienaam' : 'Bedrijfsnaam'}
            </Label>
            <Input
              id="orgName"
              placeholder={isCultural ? "Bijv. Voorbeeld Cultuurhuis" : "Bijv. TechVision BV"}
              value={meta.orgName}
              onChange={(e) => updateMeta('orgName', e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgType" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-500" />
              Type {isCultural ? 'organisatie' : 'bedrijf'}
            </Label>
            <Input
              id="orgType"
              placeholder={isCultural ? "Bijv. concertzaal, theater, museum" : "Bijv. tech startup, retail, consultancy"}
              value={meta.orgType}
              onChange={(e) => updateMeta('orgType', e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Jaar
            </Label>
            <Input
              id="year"
              type="number"
              value={meta.year}
              onChange={(e) => updateMeta('year', parseInt(e.target.value))}
              className="border-slate-300"
            />
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
