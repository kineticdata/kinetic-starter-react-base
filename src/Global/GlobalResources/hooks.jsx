// fetch and set form
import { useEffect, useState } from 'react';
import {
  fetchForm,
  fetchKapp,
  fetchProfile,
  fetchSpace,
  updateForm as formUpdate,
} from '@kineticdata/react';

export const useForm = (kappSlug, formSlug) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchFormRequest = async () => {
      const response = await fetchForm({ kappSlug, formSlug, include: 'details' });
      setForm(response.form);
    };

    fetchFormRequest().catch(console.error);
  }, [kappSlug, formSlug, setForm]);

  return form;
};

export const updateForm = async (kappSlug, formSlug, form) => {

  const response = await formUpdate ({
    kappSlug: kappSlug,
    formSlug: formSlug,
    form: { "description": form },
  });

  console.log('RESP', response)
}

export const useKapp = kappSlug => {
  const [kapp, setKapp] = useState(null);
  useEffect(() => {
    const fetchKappRequest = async () => {
      const response = await fetchKapp({ kappSlug });
      setKapp(response.kapp);
    };
    fetchKappRequest().catch(console.error);
  }, [kappSlug]);

  return kapp;
};

export const useSpace = () => {
  let space;
  useEffect(() => {
    const fetchSpaceRequest = async () => {
      const response = await fetchSpace();
      space = response.space;
    };
    fetchSpaceRequest().catch(console.error);
  }, []);

  return space;
};

export const useProfile = loggedIn => {
  const [profile, setProfile] = useState();
  useEffect(() => {
    const fetchProfileRequest = async () => {
      const response = await fetchProfile({ include: 'authorization' });
      setProfile(response.profile);
    };
    fetchProfileRequest().catch(console.error);
  }, [loggedIn]);

  return profile;
};

export const useCrumbs = ({ kappSlug, formSlug, id, form, setCrumbs }) => {
  useEffect(() => {
    const result =
      // The crumbs provide a kapp slug, form slug, and submission id, indicating
      // we're viewing a specific submission.
      kappSlug && formSlug && id
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
            {
              path: `/kapps/${kappSlug}/forms`,
              name: `${form ? form.kapp.name : 'Forms'}`,
            },
            {
              path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`,
              name: `${form ? form.name : 'Form'}`,
            },
          ]
        : // Provided a kapp slug and a form slug, meaning we're looking at a list
        // of submissions.
        kappSlug && formSlug
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
            {
              path: `/kapps/${kappSlug}/forms`,
              name: `${form ? form.kapp.name : 'Forms'}`,
            },
          ]
        : // Provided just a kappSlug, which means we're viewing a kapp.
        kappSlug
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
          ]
        : [];

    setCrumbs(result);
  }, [kappSlug, formSlug, id, form, setCrumbs]);
};
